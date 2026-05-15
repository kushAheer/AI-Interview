import React from "react";
import { getCurrentUser } from "../../../../lib/actions/auth.action";
import { getInterviewDetails } from "../../../../lib/actions/general.action";
import toast from "react-hot-toast";
import { redirect } from "next/dist/server/api-utils";
import { Badge } from "@/components/ui/badge";
import Agent from "@/components/Agent";
import { Briefcase } from "lucide-react";

async function page({ params }) {
  const { id } = await params;

  const [userDetails, interviewDetails] = await Promise.all([
    await getCurrentUser(),
    await getInterviewDetails(id),
  ]);

  if (!interviewDetails) {
    toast.error("Interview not found");
    redirect("/dashboard");
    return;
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col">
      <div className="w-full bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-row items-center justify-between">
          <div className="flex flex-row gap-4 items-center">
            <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">
                {interviewDetails.role.charAt(0).toUpperCase() + interviewDetails.role.slice(1)}{" "}
                Interview
              </h3>
              <p className="text-xs text-zinc-500 font-medium">Practice Scenario</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 font-medium">
            <span className="capitalize">{interviewDetails.type}</span> Interview
          </Badge>
        </div>
      </div>
      <div className="flex-1">
        <Agent 
          username={userDetails.name} 
          id={userDetails.uid} 
          interviewId={interviewDetails.id} 
          type={"interview"} 
          questions={interviewDetails.question} 
        />
      </div>
    </div>
  );
}

export default page;
