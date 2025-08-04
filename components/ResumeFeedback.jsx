"use client";
import React from "react";
import { useRouter } from "next/navigation";

function ResumeFeedback({ resumeId, resumeData }) {
  const router = useRouter();

  console.log("Resume Data:", resumeData);

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center min-h-screen justify-center">
        <p>Loading resume feedback...</p>
      </div>
    );
  }

  const {
    originalName,
    overallScore,
    categoryScore,
    strength,
    improvement,
    recommendations,
    summary,
  } = resumeData;

  const getCategoryInfo = (key, score) => {
    const names = {
      contentQuality: "Content Quality",
      structureFormat: "Structure & Format",
      skillsAlignment: "Skills Alignment",
      experienceImpact: "Experience Impact",
      professionalPresentation: "Professional Presentation",
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
            Resume Analysis Results -
          </h1>
          <h2 className="text-4xl font-bold text-center">{originalName}</h2>
        </div>
        <hr />

        <div className="flex flex-col items-center">
          <p className="text-center">{summary}</p>
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
                    {strength
                      .slice(index, index + 1)
                      .map((strengthItem, strengthIndex) => (
                        <li key={`strength-${strengthIndex}`}>
                          <span className="font-semibold">Strength:</span>{" "}
                          {strengthItem}
                        </li>
                      ))}
                    {improvement
                      .slice(index, index + 1)
                      .map((improvementItem, improvementIndex) => (
                        <li key={`improvement-${improvementIndex}`}>
                          <span className="font-semibold ">
                            Improvement Needed:
                          </span>{" "}
                          {improvementItem}
                        </li>
                      ))}

                    {recommendations
                      .slice(index, index + 1)
                      .map((recommendationItem, recommendationIndex) => (
                        <li key={`recommendation-${recommendationIndex}`}>
                          <span className="font-semibold ">
                            Recommendation:
                          </span>{" "}
                          {recommendationItem}
                        </li>
                      ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        {strength.length > Object.keys(categoryScore).length && (
          <div>
            <h1 className="text-2xl mt-4 font-bold text-start ">
              Additional Strengths
            </h1>
            <ul className="ml-6 mt-2 flex flex-col gap-2 list-disc">
              {strength
                .slice(Object.keys(categoryScore).length)
                .map((strengthItem, index) => (
                  <li key={`extra-strength-${index}`}>{strengthItem}</li>
                ))}
            </ul>
          </div>
        )}

        {improvement.length > Object.keys(categoryScore).length && (
          <div>
            <h1 className="text-2xl mt-4 font-bold text-start">
              Additional Areas for Improvement
            </h1>
            <ul className="ml-6 mt-2 flex flex-col gap-2 list-disc">
              {improvement
                .slice(Object.keys(categoryScore).length)
                .map((improvementItem, index) => (
                  <li key={`extra-improvement-${index}`}>{improvementItem}</li>
                ))}
            </ul>
          </div>
        )}

        {recommendations.length > Object.keys(categoryScore).length && (
          <div>
            <h1 className="text-2xl mt-4 font-bold text-start">
              Additional Recommendations
            </h1>
            <ul className="ml-6 mt-2 flex flex-col gap-2 list-disc">
              {recommendations
                .slice(Object.keys(categoryScore).length)
                .map((recommendationItem, index) => (
                  <li key={`extra-recommendation-${index}`}>
                    {recommendationItem}
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 mt-4">
          <h1 className="text-2xl font-bold text-center">Final Verdict</h1>
          <p className="text-center">
            Overall Score:{" "}
            <span className="font-bold text-2xl">{overallScore}/100</span>
          </p>
          <p className="text-center">{summary}</p>
          <div className="flex flex-row justify-center items-center gap-4 mt-2 w-full">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 flex items-center justify-center bg-[#25283a] text-white rounded-4xl px-6 py-3 w-40 min-w-[8rem] max-w-xs hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => router.push("/resume/upload")}
              className="flex-1 flex items-center justify-center bg-white text-black rounded-4xl px-6 py-3 w-40 min-w-[8rem] max-w-xs border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Upload New Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeFeedback;
