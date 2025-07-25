'use client';
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { Repeat, PhoneOff } from "lucide-react";
function page() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-row justify-between items-center p-4">
          <div>
            <h1 className="text-2xl font-bold">Frontend Developer Interview</h1>
          </div>
          <div>
            <button className="bg-light-600 text-white rounded-2xl px-4 py-2">
              Technical Interview
            </button>
          </div>
        </div>
        <div className="flex flex-row items-stretch justify-between gap-8 px-4">
          <div className="flex-1 flex flex-col">
            <Card className="flex flex-col items-center justify-center h-full p-8 shadow-md bg-gradient-to-b from-[#171434] via-[#131128] to-[#0d0c18]">
              <div className="flex justify-center items-center bg-[#8380ab] rounded-full w-32 h-32 mb-4">
                <Image
                  src={"/logo.svg"}
                  alt="Interview Image"
                  width={100}
                  height={100}
                />
              </div>
              <h1 className="text-2xl font-bold text-center">AI Interviewer</h1>
            </Card>
          </div>

          <div className="flex-1 flex flex-col">
            <Card className="flex flex-col items-center justify-center h-full p-8 shadow-md">
              <div className="flex justify-center items-center rounded-full w-32 h-32 mb-4 bg-gray-200">
                <Image
                  src={"/user-avatar.png"}
                  alt="Interview Image"
                  className="rounded-full"
                  width={100}
                  height={100}
                />
              </div>
              <h1 className="text-2xl font-bold text-center">User (You)</h1>
            </Card>
          </div>
        </div>
        <div className="flex flex-col w-full p-4 justify-center">
          <Card className="w-full h-4 flex  flex-row items-center justify-center">
            <p className="font-bold">What Job Experience Are You Targeting ? </p>
          </Card>
          <div className="flex flex-row justify-center items-center mt-4 gap-4">
            <button className="flex items-center justify-center bg-[#25283a] text-white rounded-4xl px-6 py-3 mt-4 w-40">
              <Repeat className="mr-2" />
              Repeat
            </button>
            <button className="flex items-center justify-center bg-[#f65353] text-white rounded-4xl px-6 py-3 mt-4 w-60">
              <PhoneOff className="mr-2" />
              Leave Interview
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
