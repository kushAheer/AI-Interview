"use server";
import { generateObject } from "ai";
import { db } from "../../firebase/admin";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function getUserInterview(userId) {
  const interview = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("date", "desc")
    .get();

  if (interview.empty) {
    return null;
  }

  return interview.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getAllInterviews() {
  const interviewsSnapshot = await db.collection("interviews").get();

  if (interviewsSnapshot.empty) {
    return [];
  }

  return interviewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getInterviewDetails(id) {
  const interviewDoc = await db.collection("interviews").doc(id).get();

  if (!interviewDoc.exists) {
    return null;
  }

  return { id: interviewDoc.id, ...interviewDoc.data() };
}

export async function generateFeedback(data) {
  try {
    const { interviewId, userId, transcript } = data;

    console.log(transcript);

    const transcriptFormatted = transcript
      .map((item) => `- ${item.role}: ${item.content}`)
      .join("\n");

    const prompt = `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        
        Transcript:
        ${transcriptFormatted}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
    `;

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: z.object({
        feedback: z.object({
          totalScore: z.number().min(0).max(100),
          categoryScore: z.object({
            communicationSkills: z.number().min(0).max(100),
            technicalKnowledge: z.number().min(0).max(100),
            problemSolving: z.number().min(0).max(100),
            culturalRoleFit: z.number().min(0).max(100),
            confidenceClarity: z.number().min(0).max(100),
          }),
          strength: z.array(z.string()).min(1),
          improvement: z.array(z.string()).min(1),
          finalFeedback: z.string().min(10),
        }),
      }),
      system:
        "You are an expert in providing feedback for interviews. Return data in the exact format requested.",
      prompt: prompt,
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      feedback: {
        totalScore: object.feedback.totalScore,
        categoryScore: object.feedback.categoryScore,
        strength: object.feedback.strength,
        improvement: object.feedback.improvement,
        finalFeedback: object.feedback.finalFeedback,
      },
      createdAt: new Date().toISOString(),
    };

    const feedbackDoc = await db.collection("feedback").add(feedback);

    return {
      success: true,
      message: "Feedback generated successfully.",
      feedbackId: feedbackDoc.id,
    };
  } catch (error) {
    console.error("Error generating feedback:", error);
    return {
      success: false,
      message: "Failed to generate feedback. Please try again later.",
    };
  }
}

export async function getFeedbackByInterviewId(data) {
  try {
    const { interviewId, userId } = data;

    const feedback = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();
    if (feedback.empty) {
      return null;
    }
    const feedbackData = feedback.docs[0].data();
    return {
      id: feedback.docs[0].id,
      ...feedbackData,
    };
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  }
}
