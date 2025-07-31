"use client";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { vapi } from "../lib/vapi.sdk";
import Vapi from "@vapi-ai/web";
import { interviewer } from "@/lib/vapi.interviewer.workflow";
import { generateFeedback } from "@/lib/actions/general.action";

const Agent = ({ username, id, interviewId, type, questions }) => {
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);

  const router = useRouter();
  const [callStatus, setCallStatus] = useState("INACTIVE");
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus("ACTIVE");
    };

    const onCallEnd = () => {
      setCallStatus("FINISHED");
    };

    const onMessage = (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = async (message) => {
   
    const { success , feedbackId} = await generateFeedback({
      interviewId: interviewId,
      userId: id,
      transcript : message
    })

    if(success && feedbackId) {

    
      toast.success("Feedback generated successfully!");
      router.push(`/interview/${id}/feedback`);

    }else{
      
      toast.error("Failed to generate feedback. Please try again.");
      router.push(`/dashboard`);
      
    }

  };

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    if (callStatus === "FINISHED") {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, router, type, id]);

  const handleCall = async () => {
    setCallStatus("CONNECTING");

    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    console.log("Attempting to start call with type:", type);

    if (type === "generate") {
      console.log("Using Workflow ID:", workflowId);
      console.log("With variables:", {
        username: username,
        userid: id,
      });

      await vapi.start(null, null, null, workflowId, {
        variableValues: {
          username: username,
          userid: id,
        },
      });
    } else {
      let formatedQuestion = "";

      if (questions) {
        formatedQuestion = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }
      console.log(
        "Using Interviewer Workflow with questions:",
        formatedQuestion
      );
      await vapi.start(interviewer, {
        variableValues: {
          username: username,
          interviewId: interviewId,
          questions: formatedQuestion,
        },
      });
    }
  };

  const handleDisconnect = () => {
    vapi.stop();
    setCallStatus("FINISHED");
  };

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{username}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border mt-5 mb-5">
          <div className="transcript">
            <p
              key={lastMessage}
              className={`
                transition-opacity duration-500 opacity-0
                animate-fadeIn opacity-100
              `}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={`
                absolute animate-ping rounded-full opacity-75
                ${callStatus !== "CONNECTING" && "hidden"}
              `}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
