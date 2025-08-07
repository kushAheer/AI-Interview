
import pdfParse from "pdf-parse";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { z } from "zod";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const userId = formData.get("userId");

  if (!file) {
    return Response.json(
      {
        success: false,
        message: "No file uploaded",
      },
      { status: 400 }
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return Response.json(
      {
        success: false,
        message: "File size exceeds the limit of 5MB",
      },
      { status: 400 }
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Processing PDF from memory...");

    const data = await pdfParse(buffer);
    console.log("Extracted text length:", data.text.length);

    if (!data.text || data.text.trim().length === 0) {
      return Response.json(
        {
          success: false,
          message:
            "Could not extract text from PDF. Please ensure the PDF contains readable text.",
        },
        { status: 400 }
      );
    }

    const prompt = `You are an expert resume analyzer evaluating a candidate's resume. Analyze the resume comprehensively and provide detailed, honest feedback. Don't be lenient - point out areas that need improvement.

    Resume Text:
    ${data.text}

    Analyze the resume and provide scores (0-100) for each category:
    - **Content Quality**: Relevance, depth of experience, achievements with metrics
    - **Structure & Format**: Organization, readability, professional appearance  
    - **Skills Alignment**: Technical skills relevance, skill diversity, market demand
    - **Experience Impact**: Career progression, leadership, quantifiable results
    - **Professional Presentation**: Language quality, grammar, conciseness

    Also extract key information and provide actionable feedback for improvement.`;

    const { object } = await retryWithBackoff(
      async () => {
        return await generateObject({
          model: google("gemini-2.0-flash-001"),
          schema: z.object({
            extractedInformation: z.object({
              fullName: z.string(),
              contactInfo: z.object({
                email: z.string().optional(),
                phone: z.string().optional(),
                location: z.string().optional(),
                linkedin: z.string().optional(),
                github: z.string().optional(),
                portfolio: z.string().optional(),
              }),
              summary: z.string(),
              workExperience: z.array(
                z.object({
                  jobTitle: z.string(),
                  company: z.string(),
                  location: z.string().optional(),
                  startDate: z.string().optional(),
                  endDate: z.string().optional(),
                  responsibilities: z.array(z.string()),
                  achievements: z.array(z.string()),
                })
              ),
              education: z.array(
                z.object({
                  degree: z.string(),
                  institution: z.string(),
                  location: z.string().optional(),
                  startDate: z.string().optional(),
                  endDate: z.string().optional(),
                })
              ),
              skills: z.object({
                technical: z.array(z.string()),
                soft: z.array(z.string()),
              }),
              certifications: z.array(z.string()),
              awards: z.array(z.string()),
              projects: z.array(
                z.object({
                  title: z.string(),
                  description: z.string(),
                  technologies: z.array(z.string()),
                })
              ),
            }),
            feedback: z.object({
              categoryScores: z.object({
                contentQuality: z.number().min(0).max(100),
                structureFormat: z.number().min(0).max(100),
                skillsAlignment: z.number().min(0).max(100),
                experienceImpact: z.number().min(0).max(100),
                professionalPresentation: z.number().min(0).max(100),
              }),
              overallScore: z.number().min(0).max(100),
              strengths: z.array(z.string()).min(2),
              areasForImprovement: z.array(z.string()).min(2),
              keyRecommendations: z.array(z.string()).min(3),
              summaryEvaluation: z.string().min(50),
            }),
          }),
          system:
            "You are an expert resume analyst providing structured, actionable feedback. Be thorough and honest in your evaluation.",
          prompt: prompt,
        });
      },
      3,
      2000
    );

    console.log("Successfully generated structured feedback");

    const dbResult = await db.collection("resume_analysis").add({
      originalName: file.name,
      fileName: `processed_${Date.now()}_${file.name}`,
      createdAt: new Date(),
      extractedInformation: object.extractedInformation,
      feedback: object.feedback,
      extractedText: data.text.substring(0, 1000),
      userId: userId,
      processed: true,
      fileSize: file.size,
      analysisVersion: "v2_memory_processing",
    });

    console.log("Data saved to database with ID:", dbResult.id);

    return Response.json({
      success: true,
      id: dbResult.id,
      message: "Resume analyzed successfully",
      data: {
        originalName: file.name,
        extractedInformation: object.extractedInformation,
        feedback: object.feedback,
      },
    });
  } catch (error) {
    console.error("Error processing resume:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to analyze resume",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Retry function with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      if (
        error.statusCode === 503 ||
        error.statusCode === 429 ||
        error.message.includes("overloaded")
      ) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
