"use server";
import { generateObject } from "ai";
import { db } from "../../firebase/admin";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function getUserInterview(userId) {
  if (!userId || userId === undefined || userId === null) {
    return null;
  }

  const interview = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
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
  if (!id || id === undefined || id === null) {
    return null;
  }

  const interviewDoc = await db.collection("interviews").doc(id).get();

  if (!interviewDoc.exists) {
    return null;
  }

  return { id: interviewDoc.id, ...interviewDoc.data() };
}

export async function generateFeedback(data) {
  try {
    const { interviewId, userId, transcript } = data;
    const userMessages = transcript?.filter((item) => item.role === "user");
    if (!userMessages || userMessages.length === 0) {
      return {
        success: false,
        message:
          "No user responses found in the transcript. Feedback cannot be generated.",
      };
    }

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

    const { categoryScore, strength, improvement, finalFeedback } =
      object.feedback;
    const {
      communicationSkills,
      technicalKnowledge,
      problemSolving,
      culturalRoleFit,
      confidenceClarity,
    } = categoryScore;

    const totalScore = Math.round(
      (communicationSkills +
        technicalKnowledge +
        problemSolving +
        culturalRoleFit +
        confidenceClarity) /
        5
    );

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      feedback: {
        totalScore: totalScore,
        categoryScore: categoryScore,
        strength: strength,
        improvement: improvement,
        finalFeedback: finalFeedback,
      },
      createdAt: new Date().toISOString(),
    };

    const feedbackDoc = await db.collection("feedback").add(feedback);

    const streakResult = await streakCount(userId);

    return {
      success: true,
      message: "Feedback generated successfully.",
      feedbackId: feedbackDoc.id,
      streakResponse: streakResult,
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

    if (!interviewId || !userId) {
      return {
        success: false,
        message: "Interview ID and User ID are required.",
      };
    }
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

export async function streakCount(userId) {
  try {
    const isStreakAvailable = await db
      .collection("streaks")
      .where("userId", "==", userId)
      .get();

    const streakDoc = isStreakAvailable.docs[0];
    const currentCount = streakDoc.data().count;
    const lastUpdated = new Date(streakDoc.data().lastUpdated.toDate());
    const today = new Date();

    const differenceInTime = today.getTime() - lastUpdated.getTime();
    const hoursDifference = differenceInTime / (1000 * 60 * 60);

    if (hoursDifference < 24 && currentCount > 0) {
      return {
        success: true,
        message: "Streak is still active.",
        count: currentCount,
      };
    } else {
      if (hoursDifference >= 48 && currentCount > 0) {
        await db.collection("streaks").doc(streakDoc.id).update({
          count: 0,
          lastUpdated: new Date(),
          updatedAt: new Date().toISOString(),
        });
        return {
          success: true,
          message: "Streak reset due to inactivity.",
          count: 0,
        };
      } else {
        await db
          .collection("streaks")
          .doc(streakDoc.id)
          .update({
            count: currentCount + 1,
            lastUpdated: new Date(),
            updatedAt: new Date().toISOString(),
          });
        return {
          success: true,
          message: "Streak incremented successfully.",
          count: currentCount + 1,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching streak count:", error);

    return {
      success: false,
      message: "Error updating streak.",
      count: 0,
    };
  }
}

export async function getStreakCount(userId) {
  try {
    if (!userId || userId === undefined || userId === null) {
      return null;
    }

    const streakResult = await db
      .collection("streaks")
      .where("userId", "==", userId)
      .get();

    if (streakResult.empty) {
      return {
        success: false,
        message: "No streak found for this user.",
        count: 0,
      };
    }
    const streakData = streakResult.docs[0].data();
    return {
      success: true,
      message: "Streak count retrieved successfully.",
      count: streakData.count,
    };
  } catch (error) {
    console.error("Error fetching streak count:", error);
    return {
      success: false,
      message: "Error fetching streak count.",
      count: 0,
    };
  }
}

export async function getResumeById(resumeId) {
  try {
    if (!resumeId) {
      return { success: false, message: "Resume ID is required" };
    }

    const resumeDoc = await db
      .collection("resume_analysis")
      .doc(resumeId)
      .get();

    if (!resumeDoc.exists) {
      return {
        success: false,
        message: "Resume not found",
      };
    }

    const resumeData = resumeDoc.data();

    const resultData = {
      resumeId: resumeDoc.id,
      originalName: resumeData.originalName,
      categoryScore: resumeData.feedback?.categoryScores || {},
      strength: resumeData.feedback?.strengths || [],
      overallScore: resumeData.feedback?.overallScore || 0,
      improvement: resumeData.feedback?.areasForImprovement || [],
      recommendations: resumeData.feedback?.keyRecommendations || [],
      summary: resumeData.feedback?.summaryEvaluation || "",
      userId: resumeData.userId,
    };

    return {
      success: true,
      message: "Resume fetched successfully",
      data: resultData,
    };
  } catch (error) {
    console.error("Error fetching resume:", error);
    return {
      success: false,
      message: "Error fetching resume",
      error: error.message,
    };
  }
}

export async function loginStreakCount(userId) {
  try {
    const streakResult = await db
      .collection("streaks")
      .where("userId", "==", userId)
      .get();

    if (streakResult.empty) {
      const streakData = {
        userId: userId,
        count: 0,
        lastUpdated: new Date(),
        updatedAt: new Date().toISOString(),
      };
      await db.collection("streaks").add(streakData);
      return {
        success: true,
        message: "Streak created successfully.",
        count: 0,
      };
    }
    const streakDoc = streakResult.docs[0];
    const currentCount = streakDoc.data().count;
    const lastUpdated = new Date(streakDoc.data().lastUpdated.toDate());
    const today = new Date();
    const differenceInTime = today.getTime() - lastUpdated.getTime();
    const hoursDifference = differenceInTime / (1000 * 60 * 60);

    console.log(hoursDifference);

    if (hoursDifference >= 48 && currentCount > 0) {
      await db.collection("streaks").doc(streakDoc.id).update({
        count: 0,
        lastUpdated: new Date(),
        updatedAt: new Date().toISOString(),
      });
      return {
        success: true,
        message: "Streak reset due to inactivity.",
        count: 0,
      };
    } else {
      return {
        success: true,
        message: "Streak already exists.",
        count: currentCount,
      };
    }
  } catch (error) {
    console.error("Error fetching streak count:", error);
    return {
      success: false,
      message: "Error fetching streak count.",
      count: 0,
    };
  }
}
