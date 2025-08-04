"use client";
import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

function InterviewCard({
  id,
  title,
  date,
  score,
  description,
  ButtonText,
  companyImg,
  techStack,
  key
}) {
  const generateDescription = () => {
    const role =
      title?.charAt(0).toUpperCase() + title?.slice(1) || "Interview";
    const tech =
      techStack && techStack !== "N/A" ? ` focusing on ${techStack}` : "";
    const scoreText = score !== undefined ? ` Previous score: ${score}%` : "";

    return `${role} position interview${tech}.${scoreText} Practice with AI-powered mock interviews to improve your performance.`;
  };

  return (
    <>
      <Card className="p-4 shadow-lg border-2" key={key}>
        <div className="flex flex-col gap-3">
          <Image
            src={"/covers/amazon.png"}
            alt="AI Interview Bot"
            width={60}
            height={60}
            className="rounded-lg shadow-lg max-sm:hidden"
          />
          <h4 className="text-xl font-semibold">
            {title.charAt(0).toUpperCase() + title.slice(1)} Interview
          </h4>
          <div className="flex flex-row gap-2">
            <p className="text-sm text-muted-foreground">{date}</p>
            <p className="text-sm">
              Score: {score === undefined ? "N/A" : score}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {generateDescription()}
          </p>
          <div className="flex flex-row justify-between gap-2 ">
            <Image src="/react.svg" alt="Clock Icon" width={24} height={24} />

            <Button className="mt-2 btn-secondary">
              <Link href={`/interview/${id}`} className="">
                {ButtonText}
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

export default InterviewCard;
