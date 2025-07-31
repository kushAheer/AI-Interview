"use client";
import React from "react";
import { useRouter } from "next/navigation";

function Feedback({ interviewId, feedback }) {
  const router = useRouter();

  console.log("Feedback Data:", feedback);

  if (!feedback) {
    return (
      <div className="flex flex-col items-center min-h-screen justify-center">
        <p>Loading feedback...</p>
      </div>
    );
  }

  const { totalScore, categoryScore, strength, improvement, finalFeedback } =
    feedback.feedback;

  const getCategoryInfo = (key, score) => {
    const names = {
      communicationSkills: "Communication Skills",
      technicalKnowledge: "Technical Knowledge",
      problemSolving: "Problem-Solving",
      culturalRoleFit: "Cultural & Role Fit",
      confidenceClarity: "Confidence & Clarity",
    };
    return {
      name: names[key] || key,
      score: score,
    };
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-3xl flex flex-col gap-8 mt-8 px-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold text-center">
            Feedback on the Interview -
          </h1>
          <h2 className="text-4xl font-bold text-center">Interview Results</h2>
        </div>
        <hr />

        <div className="flex flex-col items-center">
          <p className="text-center">{finalFeedback}</p>
        </div>

        <div>
          <h1 className="text-4xl mt-4 font-bold text-start">
            BreakDown Evaluation
          </h1>
          <div className="flex flex-col gap-6 mt-6">
            {Object.entries(categoryScore).map(([key, score], index) => {
              const categoryInfo = getCategoryInfo(key, score);
              return (
                <div key={key}>
                  <h2 className="text-xl font-semibold">
                    {index + 1}. {categoryInfo.name} ({categoryInfo.score}/100)
                  </h2>
                  <ul className="ml-6 mt-2 flex flex-col gap-2 list-disc">
                    {strength.slice(0, 2).map((strengthItem, strengthIndex) => (
                      <li key={`strength-${strengthIndex}`}>
                        <span className="font-semibold">Strength:</span>{" "}
                        {strengthItem}
                      </li>
                    ))}
                    {improvement
                      .slice(index, index + 1)
                      .map((improvementItem, improvementIndex) => (
                        <li key={`improvement-${improvementIndex}`}>
                          <span className="font-semibold">
                            Improvement Needed:
                          </span>{" "}
                          {improvementItem}
                        </li>
                      ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <h1 className="text-2xl font-bold text-center">Final Verdict</h1>
          <p className="text-center">
            Overall Score:{" "}
            <span className="font-bold text-2xl">{totalScore}/100</span>
          </p>
          <p className="text-center">{finalFeedback}</p>
          <div className="flex flex-row justify-center items-center gap-4 mt-2 w-full">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 flex items-center justify-center bg-[#25283a] text-white rounded-4xl px-6 py-3 w-40 min-w-[8rem] max-w-xs hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => router.push(`/interview/${interviewId}`)}
              className="flex-1 flex items-center justify-center bg-white text-black rounded-4xl px-6 py-3 w-40 min-w-[8rem] max-w-xs border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Retake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
