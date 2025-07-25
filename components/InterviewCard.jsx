"use client";
import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";

function InterviewCard({
  title,
  date,
  score,
  description,
  ButtonText,
  companyImg,
  techStack,
}) {
  return (
    <>
      <Card className="p-4 shadow-lg border-2">
        <div className="flex flex-col gap-3">
          <Image
            src={companyImg}
            alt="AI Interview Bot"
            width={60}
            height={60}
            className="rounded-lg shadow-lg max-sm:hidden"
          />
          <h4 className="text-xl font-semibold">{title}</h4>
          <div className="flex flex-row gap-2">
            <p className="text-sm text-muted-foreground">{date}</p>
            <p className="text-sm">Score: {score}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
          <div className="flex flex-row justify-between gap-2 ">
            <Image src={techStack} alt="Clock Icon" width={16} height={16} />
            <Button className="mt-2 btn-secondary">{ButtonText}</Button>
          </div>
        </div>
      </Card>
    </>
  );
}

export default InterviewCard;
