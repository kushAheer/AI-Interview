import React from "react";
import { getInterviewDetails , getCurrentUser } from "../../../../lib/actions/auth.action";
import toast from "react-hot-toast";
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Agent from "@/components/Agent";

async function page({ params }) {
  const { id } = await params;

  const [userDetails , interviewDetails] = await Promise.all([
    await getCurrentUser(),   
    await getInterviewDetails(id),
  ]);
  console.log(userDetails, interviewDetails);
  if (!interviewDetails) {
    toast.error("Interview not found");
    redirect("/dashboard");
    return;
  }

  return (
    <>
      <div className="flex flex-col gap-4 justify-center">
        <div className="flex flex-row gap-2 items-center justify-between ">
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="/covers/hostinger.png"
              alt="AI Interview Bot"
              width={60}
              height={60}
              className="rounded-lg shadow-lg max-sm:hidden"
            />
            <h3 className="text-2xl font-bold">
              {interviewDetails.role.charAt(0).toUpperCase() +
                interviewDetails.role.slice(1)}{" "}
              Interview
            </h3>
          </div>
          <Button>{interviewDetails.type} Interview</Button>
        </div>
        <div>
            <Agent username={userDetails.name} id={userDetails.uid} interviewId={interviewDetails.id} type={"interview"} questions={interviewDetails.questions} />
        </div>
      </div>
    </>
  );
}

export default page;
