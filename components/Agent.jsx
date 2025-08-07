"use client";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Vapi from "@vapi-ai/web";
import { interviewer } from "@/lib/vapi.interviewer.workflow";
import { generateFeedback } from "@/lib/actions/general.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({ username, id, interviewId, type, questions }) => {
  const vapiRef = useRef(null);
  const router = useRouter();

  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    }

    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (error) {
          console.error("Error cleaning up Vapi instance:", error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!vapiRef.current) return;

    const vapi = vapiRef.current;

    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    };

    const onError = (error) => {
      console.log("Vapi Error:", error);
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

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages) => {
      console.log("Generating feedback for messages:", messages);

      const userMessages = messages?.filter((msg) => msg.role === "user");

      if (!userMessages || userMessages.length === 0) {
        toast.error("No user messages found for feedback generation.");
        router.push("/dashboard");
        return;
      }

      if (!messages || messages.length === 0) {
        toast.error("No transcript available.");
        router.push("/dashboard");
        return;
      }

      try {
        const { success, feedbackId } = await generateFeedback({
          interviewId: interviewId,
          userId: id,
          transcript: messages,
        });

        if (success && feedbackId) {
          toast.success("Feedback generated successfully!");
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          router.push("/dashboard");
          toast.error("Failed to generate feedback. Please try again.");
        }
      } catch (error) {
        console.error("Error generating feedback:", error);
        toast.error("Failed to generate feedback. Please try again.");
        router.push("/dashboard");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/dashboard");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, router, type, id, interviewId]);

  const handleCall = async () => {
    if (!vapiRef.current) {
      toast.error("Vapi instance not initialized");
      return;
    }

    if (callStatus === CallStatus.CONNECTING) {
      console.log("Call already connecting");
      return;
    }

    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    if (!workflowId) {
      toast.error("Workflow not configured");
      return;
    }

    setCallStatus(CallStatus.CONNECTING);

    try {
      console.log("Attempting to start call with type:", type);

      if (type === "generate") {
        console.log("Using Workflow ID:", workflowId);
        console.log("With variables:", {
          username: username,
          userid: id,
        });

        await vapiRef.current.start(null, null, null, workflowId, {
          variableValues: {
            username: username,
            userid: id,
          },
        });
      } else {
        let formattedQuestions = "";

        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        console.log(
          "Using Interviewer Workflow with questions:",
          formattedQuestions
        );

        await vapiRef.current.start(interviewer, {
          variableValues: {
            username: username,
            interviewId: interviewId,
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus(CallStatus.INACTIVE);
      toast.error("Failed to start call. Please try again.");
    }
  };

  const handleDisconnect = () => {
    if (!vapiRef.current) return;

    console.log("Disconnecting call...");
    setCallStatus(CallStatus.FINISHED);

    try {
      vapiRef.current.stop();
    } catch (error) {
      console.error("Error stopping call:", error);
    }
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
              className="transition-opacity duration-500 animate-fadeIn opacity-100"
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-8">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            className="relative btn-call"
            onClick={handleCall}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            <span
              className={`absolute animate-ping rounded-full opacity-75 ${
                callStatus !== CallStatus.CONNECTING ? "hidden" : ""
              }`}
            />

            <span className="relative">
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger className="btn-disconnect">
              End Call
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone and Feedback will not be
                  Generated. This will end the call.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDisconnect}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </>
  );
};

export default Agent;
