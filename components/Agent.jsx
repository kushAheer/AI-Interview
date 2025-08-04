"use client";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
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

const Agent = ({ username, id, interviewId, type, questions }) => {
  const vapiRef = useRef(null);

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

  const router = useRouter();
  const [callStatus, setCallStatus] = useState("INACTIVE");
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [endingLoading, setEndingLoading] = useState(false);
  const [manualDisconnect, setManualDisconnect] = useState(false);

  useEffect(() => {
    if (!vapiRef.current) return;

    const vapi = vapiRef.current;

    const onCallStart = () => {
      if (!endingLoading) {
        setCallStatus("ACTIVE");
      }
    };

    const onCallEnd = () => {
      setCallStatus("FINISHED");
      setEndingLoading(false);
    };

    const onMessage = (message) => {
      if (endingLoading || manualDisconnect) return;

      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      if (endingLoading || manualDisconnect) return;
      console.log("Speech started");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      if (endingLoading || manualDisconnect) return;
      console.log("Speech ended");
      setIsSpeaking(false);
    };

    const onError = (error) => {
      console.log("Vapi Error:", error);
      if (endingLoading) {
        setCallStatus("FINISHED");
        setEndingLoading(false);
      }
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
  }, [endingLoading, manualDisconnect]);

  const handleGenerateFeedback = useCallback(
    async (messages) => {
      console.log("Generating feedback for messages:", messages);

      if (!messages || messages.length === 0) {
        toast.error("No transcript available.");
        router.push("/dashboard");
        return;
      }

      const { success, feedbackId } = await generateFeedback({
        interviewId: interviewId,
        userId: id,
        transcript: messages,
      });

      if (success && feedbackId) {
        toast.success("Feedback generated successfully!");
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        router.push(`/dashboard`);
        toast.error("Failed to generate feedback. Please try again.");
      }
    },
    [id, interviewId, router]
  );

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    if (callStatus === "FINISHED") {
      if (manualDisconnect) {
        router.push("/dashboard");
      } else if (type === "generate") {
        router.push("/dashboard");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [
    messages,
    callStatus,
    router,
    type,
    manualDisconnect,
    handleGenerateFeedback,
  ]);

  const handleCall = async () => {
    if (!vapiRef.current) {
      toast.error("Vapi instance not initialized");
      return;
    }

    setCallStatus("CONNECTING");
    setManualDisconnect(false);
    setEndingLoading(false);

    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    console.log("Attempting to start call with type:", type);

    try {
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
        await vapiRef.current.start(interviewer, {
          variableValues: {
            username: username,
            interviewId: interviewId,
            questions: formatedQuestion,
          },
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus("INACTIVE");
      toast.error("Failed to start call. Please try again.");
    }
  };

  const handleDisconnect = () => {
    if (!vapiRef.current) return;

    console.log("Disconnecting call...");
    setManualDisconnect(true);
    setEndingLoading(true);
    setIsSpeaking(false);

    if (callStatus === "ACTIVE") {
      try {
        vapiRef.current.stop();
      } catch (error) {
        console.error("Error stopping call:", error);
        setCallStatus("FINISHED");
        setEndingLoading(false);
      }
    } else {
      setCallStatus("FINISHED");
      setEndingLoading(false);
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
              className={`
                transition-opacity duration-500
                animate-fadeIn opacity-100
              `}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-8">
        {callStatus !== "ACTIVE" ? (
          <button
            className="relative btn-call"
            onClick={handleCall}
            disabled={callStatus === "CONNECTING"}
          >
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
          <AlertDialog>
            <AlertDialogTrigger className="btn-disconnect">
              {endingLoading ? "Ending Call..." : "End Call"}
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
