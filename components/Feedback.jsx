"use client";
import React from "react";

function Feedback() {
  return (
    <div className="flex flex-col items-center min-h-screen ">
      <div className="w-full max-w-3xl flex flex-col gap-8 mt-8 px-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold text-center">
            Feedback on the Interview -
          </h1>
          <h2 className="text-4xl font-bold text-center">
            Frontend Developer Interview
          </h2>
        </div>
        <hr />

        <div className="flex flex-col items-center">
          <p className="text-center">
            This interview does not effect serious engagement from candidate.
            Their responses are dismissive, vague or outright negative, making
            it difficult to assess their qualification, motivation or stability
            for the role.
          </p>
        </div>

        <div>
          <h1 className="text-4xl mt-4 font-bold text-start">
            BreakDown Evaluation
          </h1>
          <div className="flex flex-col gap-6 mt-6">
            <h2 className="text-xl font-semibold">
              1. Enthusiasm & Interest (5/10)
            </h2>
            <ul className="ml-6 mt-2 flex flex-col gap-2 list-disc">
              <li>
                The candidate's communication skills were poor, with vague and
                dismissive responses.
              </li>
              <li>
                <span className="font-semibold">Technical Knowledge:</span> The
                candidate's technical knowledge was not demonstrated
                effectively, leading to concerns about their qualifications.
              </li>
            </ul>

            <h2 className="text-xl font-semibold">
              2. Communication Skills (5/10)
            </h2>
            <ul className="ml-6 mt-2 flex flex-col gap-2 list-disc">
              <li>
                The candidate's communication skills were poor, with vague and
                dismissive responses.
              </li>
              <li>
                <span className="font-semibold">Technical Knowledge:</span> The
                candidate's technical knowledge was not demonstrated
                effectively, leading to concerns about their qualifications.
              </li>
            </ul>

            <h2 className="text-xl font-semibold">
              3. Self Awareness & Reflection (5/10)
            </h2>
            <ul className="ml-6 mt-2 flex flex-col gap-2 list-disc">
              <li>
                The candidate's communication skills were poor, with vague and
                dismissive responses.
              </li>
              <li>
                <span className="font-semibold">Technical Knowledge:</span> The
                candidate's technical knowledge was not demonstrated
                effectively, leading to concerns about their qualifications.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <h1 className="text-2xl font-bold text-center">Final Verdict</h1>
          <p className="text-center">
            The candidate's performance in the interview was unsatisfactory,
            with poor communication skills and a lack of enthusiasm. Their
            responses were vague and dismissive, making it difficult to assess
            their qualifications and motivation for the role.
          </p>
          <div className="flex flex-row justify-center items-center gap-4 mt-2 w-full">
            <button className="flex-1 flex items-center justify-center bg-[#25283a] text-white rounded-4xl px-6 py-3 w-40 min-w-[8rem] max-w-xs">
              Back to Dashboard
            </button>
            <button className="flex-1 flex items-center justify-center bg-white text-black rounded-4xl px-6 py-3 w-40 min-w-[8rem] max-w-xs">
              Retake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
