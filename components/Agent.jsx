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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Brain, 
  User,
  MessageCircle,
  Activity,
  Timer,
  Sparkles
} from "lucide-react";

const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({ username, id, interviewId, type, questions }) => {
  const vapiRef = useRef(null);
  const router = useRouter();
  const callInitiatedRef = useRef(false);

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
      callInitiatedRef.current = false;
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

      callInitiatedRef.current = false;
      setCallStatus(CallStatus.INACTIVE);
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
    if (callInitiatedRef.current) {
      console.log("Call already in progress, ignoring duplicate request.");
      return;
    }

    callInitiatedRef.current = true;
    setCallStatus(CallStatus.CONNECTING);

    if (!vapiRef.current) {
      toast.error("Vapi instance not initialized");
      callInitiatedRef.current = false;
      return;
    }

    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    if (!workflowId) {
      toast.error("Workflow not configured");
      callInitiatedRef.current = false;
      return;
    }

    try {
      console.log("Attempting to start call with type:", type);

      if (type === "generate") {
        console.log("Using  WorkflowID:", workflowId);
        console.log("With variables:", {
          username: username,
          userid: id,
        });

        await vapiRef.current.start(workflowId, {
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
      toast.error("Failed to start call. Please try again.");

      callInitiatedRef.current = false;
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    if (!vapiRef.current) return;

    console.log("Disconnecting call...");
    setCallStatus(CallStatus.FINISHED);

    callInitiatedRef.current = false;

    try {
      vapiRef.current.stop();
    } catch (error) {
      console.error("Error stopping call:", error);
    }
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case CallStatus.ACTIVE:
        return "bg-green-100 text-green-800 border-green-200";
      case CallStatus.CONNECTING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case CallStatus.FINISHED:
        return "bg-zinc-100 text-zinc-800 border-zinc-200";
      default:
        return "bg-zinc-100 text-zinc-800 border-zinc-200";
    }
  };

  const getStatusText = () => {
    switch (callStatus) {
      case CallStatus.ACTIVE:
        return "Interview Active";
      case CallStatus.CONNECTING:
        return "Connecting...";
      case CallStatus.FINISHED:
        return "Interview Ended";
      default:
        return "Ready to Start";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 p-6 flex flex-col justify-center pb-20">
      <div className="max-w-4xl mx-auto space-y-8 w-full">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-3 py-1 font-normal text-zinc-500 border-zinc-200 bg-white">
            <Sparkles className="w-3 h-3 mr-2" />
            AI Interview Session
          </Badge>
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">Interview in Progress</h1>
          <Badge className={`px-4 py-1.5 font-medium border ${getStatusColor()}`}>
            <Activity className="w-4 h-4 mr-2" />
            {getStatusText()}
          </Badge>
        </div>

        {/* Video Call Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* AI Interviewer Card */}
          <Card className="border border-zinc-200 shadow-sm bg-white overflow-hidden relative">
            <CardContent className="p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-zinc-100 border border-zinc-200 rounded-full flex items-center justify-center relative z-10">
                  <Brain className="w-10 h-10 text-zinc-800" />
                </div>
                {isSpeaking && (
                  <div className="absolute inset-0 w-24 h-24 rounded-full bg-zinc-200 animate-ping opacity-50 z-0"></div>
                )}
                {callStatus === CallStatus.ACTIVE && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-20">
                    <Mic className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-1">HireSmart AI</h3>
              <p className="text-zinc-500 text-sm">Interviewer</p>
              
              <div className="h-8 mt-4">
                {isSpeaking && (
                  <Badge variant="outline" className="bg-zinc-50 text-zinc-600 border-zinc-200 font-normal shadow-sm">
                    <MessageCircle className="w-3 h-3 mr-2" />
                    Speaking...
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Card */}
          <Card className="border border-zinc-200 shadow-sm bg-white overflow-hidden relative">
            <CardContent className="p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-zinc-100 border border-zinc-200 rounded-full flex items-center justify-center relative z-10">
                  <User className="w-10 h-10 text-zinc-400" />
                </div>
                {callStatus === CallStatus.ACTIVE && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-20">
                    <Mic className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-1">{username || "Candidate"}</h3>
              <p className="text-zinc-500 text-sm">Candidate</p>
              
              <div className="h-8 mt-4">
                {callStatus === CallStatus.ACTIVE && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-normal shadow-sm">
                    <Timer className="w-3 h-3 mr-2" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Transcript */}
        {messages.length > 0 && (
          <Card className="border border-zinc-200 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-4 h-4 text-zinc-500" />
                <h3 className="text-sm font-semibold text-zinc-900">Live Transcript</h3>
              </div>
              <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-5 min-h-[100px]">
                <p className="text-zinc-700 text-sm leading-relaxed transition-opacity duration-500 animate-fadeIn">
                  {lastMessage || "Conversation will appear here..."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call Controls */}
        <div className="flex justify-center pt-4">
          {callStatus !== CallStatus.ACTIVE ? (
            <Button
              onClick={handleCall}
              disabled={callInitiatedRef.current}
              size="lg"
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-8 h-14 rounded-full shadow-sm"
            >
              {callStatus === CallStatus.CONNECTING ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Start Interview Session
                </div>
              )}
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 h-14 rounded-full shadow-sm"
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Interview
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border border-zinc-200 rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-zinc-900">End Interview Session?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500">
                    This will end the current interview session. If you end the interview now, 
                    feedback may not be generated properly. Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-zinc-200 text-zinc-900 hover:bg-zinc-50">Continue Interview</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDisconnect}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    End Interview
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

      </div>
    </div>
  );
};

export default Agent;