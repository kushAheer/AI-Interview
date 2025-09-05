"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  FileText, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  Star,
  ArrowLeft,
  Upload,
  Brain,
  Award
} from "lucide-react";

function ResumeFeedback({ resumeId, resumeData }) {
  const router = useRouter();

  console.log("Resume Data:", resumeData);

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600">Loading resume feedback...</p>
        </div>
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
    const categories = {
      contentQuality: { 
        name: "Content Quality", 
        icon: FileText,
        description: "Quality and relevance of content"
      },
      structureFormat: { 
        name: "Structure & Format", 
        icon: Target,
        description: "Organization and visual appeal"
      },
      skillsAlignment: { 
        name: "Skills Alignment", 
        icon: CheckCircle,
        description: "Relevance to target positions"
      },
      experienceImpact: { 
        name: "Experience Impact", 
        icon: TrendingUp,
        description: "Quantified achievements and results"
      },
      professionalPresentation: { 
        name: "Professional Presentation", 
        icon: Star,
        description: "Overall professional appearance"
      },
    };
    return {
      ...categories[key] || { name: key, icon: FileText, description: "" },
      score: score,
    };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getOverallScoreColor = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            AI-Powered Analysis Complete
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Resume Analysis Results
          </h1>
          <div className="flex items-center justify-center gap-2 text-xl text-gray-600">
            <FileText className="w-5 h-5" />
            {originalName}
          </div>
        </div>

        {/* Overall Score Section */}
        <Card className="border-0 shadow-xl mb-12 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getOverallScoreColor(overallScore)} flex items-center justify-center`}>
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{overallScore}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Overall Score</h2>
                <p className="text-gray-600 max-w-2xl">{summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Detailed Breakdown</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(categoryScore).map(([key, score], index) => {
              const categoryInfo = getCategoryInfo(key, score);
              const IconComponent = categoryInfo.icon;
              return (
                <Card key={key} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{categoryInfo.name}</CardTitle>
                          <p className="text-sm text-gray-500">{categoryInfo.description}</p>
                        </div>
                      </div>
                      <Badge className={`px-3 py-1 border ${getScoreColor(score)}`}>
                        {score}/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {strength[index] && (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-green-800">Strength</p>
                          <p className="text-sm text-gray-600">{strength[index]}</p>
                        </div>
                      </div>
                    )}
                    {improvement[index] && (
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-yellow-800">Improvement Needed</p>
                          <p className="text-sm text-gray-600">{improvement[index]}</p>
                        </div>
                      </div>
                    )}
                    {recommendations[index] && (
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-blue-800">Recommendation</p>
                          <p className="text-sm text-gray-600">{recommendations[index]}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Additional Strengths */}
          {strength.length > Object.keys(categoryScore).length && (
            <Card className="border-0 shadow-lg bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Award className="w-5 h-5" />
                  Additional Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strength
                    .slice(Object.keys(categoryScore).length)
                    .map((strengthItem, index) => (
                      <li key={`extra-strength-${index}`} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{strengthItem}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Additional Improvements */}
          {improvement.length > Object.keys(categoryScore).length && (
            <Card className="border-0 shadow-lg bg-yellow-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <TrendingUp className="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {improvement
                    .slice(Object.keys(categoryScore).length)
                    .map((improvementItem, index) => (
                      <li key={`extra-improvement-${index}`} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{improvementItem}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Additional Recommendations */}
          {recommendations.length > Object.keys(categoryScore).length && (
            <Card className="border-0 shadow-lg bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Lightbulb className="w-5 h-5" />
                  Additional Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations
                    .slice(Object.keys(categoryScore).length)
                    .map((recommendationItem, index) => (
                      <li key={`extra-recommendation-${index}`} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{recommendationItem}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <Button
                onClick={() => router.push("/resume/analyser")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Analyze Another Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ResumeFeedback;