import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "../../../lib/actions/auth.action";
import {
  getAllInterviews,
  getUserInterview,
} from "../../../lib/actions/general.action";
import Image from "next/image";

import React from "react";
import Link from "next/link";

async function page() {
  const user = await getCurrentUser();

  const [userInterview, allInterviews] = await Promise.all([
    await getUserInterview(user?.uid),
    await getAllInterviews(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="card-cta py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-12">
          <div className="flex flex-col gap-4 p-2 text-center lg:text-left lg:flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Get Interview Ready with AI-Powered Practice and Feedback
            </h1>
            <p className="text-lg">
              Practice Real Interview Questions, Get AI Feedback, and Get
              Instant Feedback
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button className="w-full sm:w-1/2 lg:w-auto px-6 py-2 btn-primary">
                <Link href="/interview">Start Interview</Link>
              </Button>
            </div>
          </div>
          <div className="lg:flex-1 flex justify-center">
            <Image
              src="/robot.png"
              alt="AI Interview Bot"
              width={500}
              height={300}
              className="rounded-lg shadow-lg max-sm:w-full max-sm:max-w-sm sm:max-w-md lg:max-w-lg"
            />
          </div>
        </div>
      </section>

      <section className="features py-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-6">
          Your Past Interviews
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No past interviews found.</p>
            </div>
          )}
        </div>
      </section>

      <section className="features py-8 pb-16">
        <h3 className="text-xl sm:text-2xl font-bold mb-6">
          Pick Your Interview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No interviews available.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default page;
