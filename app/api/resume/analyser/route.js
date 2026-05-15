import pdfParse from "pdf-parse";
import { generateObject } from "ai";
import { createGroq } from "@ai-sdk/groq";

import { db } from "@/firebase/admin";
import { z } from "zod";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const userId = formData.get("userId");

  if (!file) {
    return Response.json(
      { success: false, message: "No file uploaded" },
      { status: 400 }
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return Response.json(
      { success: false, message: "File size exceeds the limit of 5MB" },
      { status: 400 }
    );
  }

  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { success: false, message: "Missing GROQ_API_KEY environment variable" },
      { status: 500 }
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const data = await pdfParse(buffer);

    if (!data.text || data.text.trim().length === 0) {
      return Response.json(
        { success: false, message: "Could not extract text from PDF. Please ensure the PDF contains readable text." },
        { status: 400 }
      );
    }

    const resumeText = data.text.substring(0, 6000);

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
    const model = groq(process.env.GROQ_MODEL || "llama-3.3-70b-versatile");

  
    const { object: extractedInformation } = await retryWithBackoff(() =>
      generateObject({
        model,
        schema: z.object({
          fullName: z.string(),
          contactInfo: z.object({
            email: z.string().nullable(),
            phone: z.string().nullable(),
            location: z.string().nullable(),
            linkedin: z.string().nullable(),
            github: z.string().nullable(),
            portfolio: z.string().nullable(),
          }),
          summary: z.string(),
          workExperience: z.array(
            z.object({
              jobTitle: z.string(),
              company: z.string(),
              location: z.string().nullable(),
              startDate: z.string().nullable(),
              endDate: z.string().nullable(),
              responsibilities: z.array(z.string()),
              achievements: z.array(z.string()),
            })
          ),
          education: z.array(
            z.object({
              degree: z.string(),
              institution: z.string(),
              location: z.string().nullable(),
              startDate: z.string().nullable(),
              endDate: z.string().nullable(),
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
        system: "You are a resume parser. Extract all information from the resume accurately. Use null for missing fields and empty arrays for missing lists.",
        prompt: `Extract all information from this resume:\n\n${resumeText}`,
      })
    );


    const { object: feedback } = await retryWithBackoff(() =>
      generateObject({
        model,
        schema: z.object({
          categoryScores: z.object({
            contentQuality: z.number(),
            structureFormat: z.number(),
            skillsAlignment: z.number(),
            experienceImpact: z.number(),
            professionalPresentation: z.number(),
          }),
          overallScore: z.number(),
          strengths: z.array(z.string()),
          areasForImprovement: z.array(z.string()),
          keyRecommendations: z.array(z.string()),
          summaryEvaluation: z.string(),
        }),
        system: "You are an expert resume reviewer. Score and give honest, actionable feedback.",
        prompt: `Review this resume and provide detailed feedback with scores from 0-100 for each category.

You MUST include ALL of these in your response:
- categoryScores with 5 scores (contentQuality, structureFormat, skillsAlignment, experienceImpact, professionalPresentation) each 0-100
- overallScore (0-100)
- strengths (list at least 2 things the resume does well)
- areasForImprovement (list at least 2 weaknesses)
- keyRecommendations (list at least 3 specific actions to improve)
- summaryEvaluation (2-3 sentences overall assessment)

Resume:
${resumeText}`,
      })
    );

    const dbResult = await db.collection("resume_analysis").add({
      originalName: file.name,
      fileName: `processed_${Date.now()}_${file.name}`,
      createdAt: new Date(),
      extractedInformation,
      feedback,
      extractedText: data.text.substring(0, 1000),
      userId,
      processed: true,
      fileSize: file.size,
      analysisVersion: "v3_split_calls",
    });

    return Response.json({
      success: true,
      id: dbResult.id,
      message: "Resume analyzed successfully",
      data: {
        originalName: file.name,
        extractedInformation,
        feedback,
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
        error.message?.includes("overloaded")
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