import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
// gap-6 max-w-lg mx-auto p-4 align-middle
function page() {
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
          <InterviewCard
            title={"Interview with Google"}
            date={"2023-10-01"}
            score={"85%"}
            description={
              " Had a great interview with Google focusing on algorithms and data structures."
            }
            ButtonText={"View Details"}
            companyImg={"/covers/facebook.png"}
            techStack={"/react.svg"}
          />
          <InterviewCard
            title={"Interview with Amazon"}
            date={"2023-10-01"}
            score={"85%"}
            description={
              "Focused on system design and behavioral questions. Great experience!"
            }
            ButtonText={"View Details"}
            companyImg={"/covers/amazon.png"}
            techStack={"/tailwind.svg"}
          />
          <InterviewCard
            title={"Interview with Google"}
            date={"2023-10-01"}
            score={"85%"}
            description={
              " Had a great interview with Google focusing on algorithms and data structures."
            }
            ButtonText={"View Details"}
            companyImg={"/covers/facebook.png"}
            techStack={"/react.svg"}
          />
        </div>
      </section>
      <section className="features">
        <h3>Pick Your Interview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          <InterviewCard
            title={"Interview with Amazon"}
            date={"2023-10-01"}
            score={"90%"}
            description={
              "Focused on system design and behavioral questions. Great experience!"
            }
            ButtonText={"Start Interview"}
            companyImg={"/covers/amazon.png"}
            techStack={"/react.svg"}
          />
          <InterviewCard
            title={"Interview with Microsoft"}
            date={"2023-10-02"}
            score={"88%"}
            description={
              "Covered a wide range of topics including algorithms and system design."
            }
            ButtonText={"Start Interview"}
            companyImg={"/covers/skype.png"}
            techStack={"/react.svg"}
          />
        </div>
      </section>
    </>
  );
}

export default page;
