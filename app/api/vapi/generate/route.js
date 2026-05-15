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
  let type, role, level, techstack, amount, userid;
  let isVapiToolCall = false;
  let toolCallId = null;

  try {
    const body = await request.json();
    console.log("Received request body:", JSON.stringify(body, null, 2));

    if (body.message && body.message.type === "tool-calls" && body.message.toolWithToolCallList && body.message.toolWithToolCallList.length > 0) {
      isVapiToolCall = true;
      const toolCall = body.message.toolWithToolCallList[0].toolCall;
      toolCallId = toolCall.id;
      const args = toolCall.function.arguments;
      const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
      
      const callVars = body.message.call?.variableValues || {};
      
      type = parsedArgs.type || "mock";
      role = parsedArgs.role || "Software Engineer";
      level = parsedArgs.level || "mid-level";
      techstack = parsedArgs.techstack || "general";
      amount = parsedArgs.amount || 5;
      userid = parsedArgs.userid || callVars.userid || null;
    } else {
      ({ type, role, level, techstack, amount, userid } = body);
    }

    // DEBUG LOG TO FIREBASE
    await db.collection("debug_vapi").add({
      event: "incoming_request",
      body: body,
      extracted: { type, role, level, techstack, amount, userid },
      toolCallId,
      createdAt: new Date().toISOString()
    });

    if (!type || !role || !level || !techstack || !amount || !userid) {
      if (isVapiToolCall && toolCallId) {
        return Response.json({
          results: [{
            toolCallId,
            result: "Error: Missing required fields (userid is required)."
          }]
        });
      }
      return Response.json({ success: false, message: "Missing required fields" });
    }

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

    if (!process.env.XAI_API_KEY) {
      throw new Error("XAI_API_KEY environment variable is not configured.");
    }

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
    
    await db.collection("debug_vapi").add({
      event: "success",
      toolCallId,
      createdAt: new Date().toISOString()
    });

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
    console.error("Vapi webhook error:", error);
    
    await db.collection("debug_vapi").add({
      event: "error",
      errorMessage: error.message,
      toolCallId: toolCallId || null,
      createdAt: new Date().toISOString()
    }).catch(e => console.error("Could not save debug log", e));

    if (isVapiToolCall && toolCallId) {
      return Response.json({
        results: [{
          toolCallId: toolCallId,
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
