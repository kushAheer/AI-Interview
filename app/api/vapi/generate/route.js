
import { db } from "../../../../firebase/admin.js";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function GET(request) {
  return Response.json({
    success: true,
    message: "VAPI is running",
  });
}



export async function POST(request) {
  const { type, role, level, techstack, amount, userId } = await request.json();

  if (!type || !role || !level || !techstack || !amount || !userId) {
  return Response.json({
    success: false,
    message: "Missing required fields in request body.",
    data : {      type,
      role,
      level,
      techstack,
      amount,
      userId
    }
  });
}

  try {
    const prompt = `
    You are an expert interviewer and you will prepare an interview for a candidate.
    Prepare an interview for a candidate.
    The interview should be for a ${role} at ${techstack} level ${level}.
    The interview should be for a ${type} position.
    The interview should consist of ${amount} questions.
    Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
    
    `;
    console.log(process.env.GEMINI_API_KEY);
    const {text } = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt : prompt,
    })
    console.log("Generated text:", text);
    const interview = {
      userId : userId,
      type : type,
      role : role,
      level : level,
      techstack : techstack,
      amount : amount,
      question : JSON.parse(text),
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({
      success: true,
      message: "Interview generated successfully",
      data: interview,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
