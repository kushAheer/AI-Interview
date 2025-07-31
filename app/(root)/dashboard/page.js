import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import {
  getCurrentUser,
} from "../../../lib/actions/auth.action";
import { getAllInterviews, getUserInterview } from "../../../lib/actions/general.action";
import Image from "next/image";

import React from "react";
// gap-6 max-w-lg mx-auto p-4 align-middle
async function page() {
  const user = await getCurrentUser();


  const [userInterview, allInterviews] = await Promise.all([
    await getUserInterview(user?.uid),
    await getAllInterviews(),
  ]);

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-4 p-2">
            <h1 className=" text-2xl font-bold">
              Get Interview Ready with AI-Powered Practice and Feedback
            </h1>
            <p className="text-lg">
              Practice Real Interview Questions, Get AI Feedback, and Get
              Instant Feedback
            </p>
            <Button className="w-1/2 btn-primary">Start Interview</Button>
          </div>
          <div>
            <Image
              src="/robot.png"
              alt="AI Interview Bot"
              width={500}
              height={300}
              className="rounded-lg shadow-lg max-sm:hidden"
            />
          </div>
        </div>
      </section>
      <section className="features">
        <h3>Your Past Interviews</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {userInterview?.length > 0 ? (
            userInterview.map((interview) => (
              
              <InterviewCard
                id={interview.id}
                key={interview.userId}
                title={interview.role}
                date={new Date(interview.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
                score={interview.score}
                description={interview.description}
                ButtonText={"View Details"}
                companyImg={interview.companyImg || "/default-company.png"}
                techStack={interview.techStack || "N/A"}
              />
            ))
          ) : (
            <p>No past interviews found.</p>
          )}
        </div>
      </section>
      <section className="features">
        <h3>Pick Your Interview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {allInterviews?.length > 0 ? (
            allInterviews.map((interview) => (
              <InterviewCard
                id={interview.id}
                key={interview.id}
                title={interview.role}
                date={new Date(interview.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
                score={interview.score}
                description={interview.description}
                ButtonText={"View Details"}
                companyImg={interview.companyImg}
                techStack={interview.techStack}
              />
            ))
          ) : (
            <p>No interviews available.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default page;
