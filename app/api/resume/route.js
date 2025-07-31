import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import pdf from "pdf-parse";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get("resume");
    const userId = formData.get("userId");

    if (!resumeFile || !userId) {
      return Response.json({
        success: false,
        message: "Missing required fields in request body.",
      });
    }

    if (resumeFile.type !== "application/pdf") {
      return Response.json({
        success: false,
        message: "Please upload a valid PDF file.",
      });
    }

    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    const prompt = `You are an expert resume analyzer. 
        Analyze the following resume text. Extract the candidate's key information, including:
Full Name
Contact Information (email, phone, location)
LinkedIn/GitHub/Portfolio Links
Summary/Profile
Work Experience (Job Titles, Companies, Dates, Responsibilities, Achievements)
Education (Degrees, Institutions, Dates)
Skills (Technical and Soft Skills)
Certifications and Awards
Projects (if available)
After extraction, perform the following:

Scoring (out of 100 total):
Relevance to a [JOB ROLE or INDUSTRY]: /30
Experience Depth & Impact: /20
Clarity and Formatting: /10
Skills Match: /20
Achievements & Metrics: /10
Language & Professionalism: /10

Feedback:
Highlight 3 strengths of the resume.
Suggest 3 areas for improvement (e.g., formatting, clarity, missing details, better metrics).
Provide a short summary evaluation (2-3 sentences) on how competitive this resume is for [insert job/role].

Give the output in this format :
{
  "extracted_information": {
    "full_name": "",
    "contact_info": {
      "email": "",
      "phone": "",
      "location": "",
      "linkedin": "",
      "github": "",
      "portfolio": ""
    },
    "summary": "",
    "work_experience": [
      {
        "job_title": "",
        "company": "",
        "location": "",
        "start_date": "",
        "end_date": "",
        "responsibilities": [],
        "achievements": []
      }
    ],
    "education": [
      {
        "degree": "",
        "institution": "",
        "location": "",
        "start_date": "",
        "end_date": ""
      }
    ],
    "skills": {
      "technical": [],
      "soft": []
    },
    "certifications": [],
    "awards": [],
    "projects": [
      {
        "title": "",
        "description": "",
        "technologies": []
      }
    ]
  },
  "scoring": {
    "relevance_to_job_role": 0,
    "experience_depth_and_impact": 0,
    "clarity_and_formatting": 0,
    "skills_match": 0,
    "achievements_and_metrics": 0,
    "language_and_professionalism": 0,
    "total_score": 0
  },
  "feedback": {
    "strengths": [
      ""
    ],
    "areas_for_improvement": [
      ""
    ],
    "summary_evaluation": ""
  }
}

Resume Text: ${resumeText}`;

    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: prompt,
    });

    const result = {
      data: JSON.parse(text),
      userId: userId,
      createdAt: new Date().toISOString(),
    };

    const resumeResult = await db.collection("resume_analysis").add(result);

    return Response.json({
      success: true,
      message: "Resume analysis completed successfully",
      data: {
        id: resumeResult.id,
        ...result,
      },
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "An error occurred during resume analysis.",
      error: error.message,
    });
  }
}
