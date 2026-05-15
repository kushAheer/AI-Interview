import { db } from "../../../../firebase/admin.js";
import { generateObject } from "ai";
import { z } from "zod";
import { createXai } from "@ai-sdk/xai";

export async function GET(request) {
  return Response.json({
    success: true,
    message: "VAPI is running",
  });
}

export async function POST(request) {
  const body = await request.json();
  console.log("Received request body:", JSON.stringify(body, null, 2));

  let type, role, level, techstack, amount, userid;
  let isVapiToolCall = false;
  let toolCallId = null;

  if (body.message && body.message.type === "tool-calls" && body.message.toolWithToolCallList && body.message.toolWithToolCallList.length > 0) {
    isVapiToolCall = true;
    const toolCall = body.message.toolWithToolCallList[0].toolCall;
    toolCallId = toolCall.id;
    const args = toolCall.function.arguments;
    const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
    ({ type, role, level, techstack, amount, userid } = parsedArgs);
  } else {
    ({ type, role, level, techstack, amount, userid } = body);
  }

  if (!type || !role || !level || !techstack || !amount || !userid) {
    const errorResponse = {
      success: false,
      message: "Missing required fields in request body.",
      data: { type, role, level, techstack, amount, userid },
    };
    
    if (isVapiToolCall && toolCallId) {
      return Response.json({
        results: [{
          toolCallId,
          result: "Error: Missing required fields in request body."
        }]
      });
    }
    return Response.json(errorResponse);
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

    const xai = createXai({ apiKey: process.env.XAI_API_KEY });

    const { object } = await generateObject({
      model: xai(process.env.XAI_MODEL || "grok-beta"),
      schema: z.object({
        questions: z.array(z.string())
      }),
      prompt: prompt,
    });

    const interview = {
      userId: userid,
      type: type,
      role: role,
      level: level,
      techstack: techstack,
      amount: amount,
      question: object.questions,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    if (isVapiToolCall && toolCallId) {
      return Response.json({
        results: [{
          toolCallId,
          result: "Interview generated successfully."
        }]
      });
    }

    return Response.json({
      success: true,
      message: "Interview generated successfully",
      data: interview,
    });
  } catch (error) {
    if (isVapiToolCall && toolCallId) {
      return Response.json({
        results: [{
          toolCallId,
          result: `Error generating interview: ${error.message}`
        }]
      });
    }

    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
