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

        await vapiRef.current.start(null,null,null,workflowId, {
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
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI Interview Session
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Interview in Progress</h1>
          <Badge className={`px-4 py-2 border ${getStatusColor()}`}>
            <Activity className="w-4 h-4 mr-2" />
            {getStatusText()}
          </Badge>
        </div>

        {/* Video Call Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* AI Interviewer Card */}
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="w-16 h-16 text-white" />
                </div>
                {isSpeaking && (
                  <div className="absolute inset-0 w-32 h-32 rounded-full bg-blue-400 animate-ping opacity-30"></div>
                )}
                {callStatus === CallStatus.ACTIVE && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Mic className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Interviewer</h3>
              <p className="text-gray-600 text-sm">HireSmart Assistant</p>
              {isSpeaking && (
                <Badge className="mt-4 bg-blue-100 text-blue-800">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Speaking...
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* User Card */}
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 text-gray-500" />
                </div>
                {callStatus === CallStatus.ACTIVE && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Mic className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{username}</h3>
              <p className="text-gray-600 text-sm">Candidate</p>
              {callStatus === CallStatus.ACTIVE && (
                <Badge className="mt-4 bg-green-100 text-green-800">
                  <Timer className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Live Transcript */}
        {messages.length > 0 && (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Live Transcript</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                <p className="text-gray-800 transition-opacity duration-500 animate-fadeIn">
                  {lastMessage || "Conversation will appear here..."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call Controls */}
        <div className="flex justify-center">
          {callStatus !== CallStatus.ACTIVE ? (
            <Button
              onClick={handleCall}
              disabled={callInitiatedRef.current}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg"
            >
              {callStatus === CallStatus.CONNECTING ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Start Interview
                </div>
              )}
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  End Interview
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>End Interview Session?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will end the current interview session. If you end the interview now, 
                    feedback may not be generated properly. Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continue Interview</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDisconnect}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    End Interview
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Tips */}
        <Card className="border-0 shadow-lg bg-yellow-50/50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-yellow-800 mb-3">💡 Interview Tips</h4>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="text-black"> Speak clearly and at a normal pace</li>
              <li className="text-black"> Take your time to think before answering</li>
              <li className="text-black"> Use specific examples to support your answers</li>
              <li className="text-black"> Ask questions if you need clarification</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Agent;