"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  Target, 
  Brain, 
  MessageSquare, 
  Code, 
  Users, 
  Lightbulb,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Award
} from "lucide-react";

function Feedback({ interviewId, feedback }) {
  const router = useRouter();

  console.log("Feedback Data:", feedback);

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600">Loading interview feedback...</p>
        </div>
      </div>
    );
  }

  const { totalScore, categoryScore, strength, improvement, finalFeedback } =
    feedback.feedback;

  const getCategoryInfo = (key, score) => {
    const categories = {
      communicationSkills: { 
        name: "Communication Skills", 
        icon: MessageSquare,
        description: "Clarity and effectiveness of communication"
      },
      technicalKnowledge: { 
        name: "Technical Knowledge", 
        icon: Code,
        description: "Understanding of technical concepts"
      },
      problemSolving: { 
        name: "Problem-Solving", 
        icon: Lightbulb,
        description: "Analytical thinking and solution approach"
      },
      culturalRoleFit: { 
        name: "Cultural & Role Fit", 
        icon: Users,
        description: "Alignment with company culture and role"
      },
      confidenceClarity: { 
        name: "Confidence & Clarity", 
        icon: Target,
        description: "Confidence level and clear expression"
      },
    };
    return {
      ...categories[key] || { name: key, icon: Brain, description: "" },
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
            Interview Analysis Complete
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Interview Feedback
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive analysis of your interview performance
          </p>
        </div>

        {/* Overall Score Section */}
        <Card className="border-0 shadow-xl mb-12 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getOverallScoreColor(totalScore)} flex items-center justify-center`}>
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{totalScore}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Overall Performance</h2>
                <p className="text-gray-600 max-w-2xl">{finalFeedback}</p>
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
                    {/* Strengths */}
                    {strength.slice(0, 2).map((strengthItem, strengthIndex) => (
                      <div key={`strength-${strengthIndex}`} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-green-800">Strength</p>
                          <p className="text-sm text-gray-600">{strengthItem}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Improvements */}
                    {improvement.slice(index, index + 1).map((improvementItem, improvementIndex) => (
                      <div key={`improvement-${improvementIndex}`} className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-yellow-800">Improvement Needed</p>
                          <p className="text-sm text-gray-600">{improvementItem}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Final Summary */}
        <Card className="border-0 shadow-xl mb-12 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <h3 className="text-2xl font-bold text-gray-900">Final Assessment</h3>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {totalScore}/100
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {finalFeedback}
              </p>
            </div>
          </CardContent>
        </Card>

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
                onClick={() => router.push(`/interview/${interviewId}`)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Interview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="border-0 shadow-lg bg-yellow-50/50 mt-8">
          <CardContent className="p-6">
            <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Tips for Improvement
            </h4>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="text-black"> Review your weak areas and practice with similar questions</li>
              <li className="text-black"> Work on speaking clearly and confidently</li>
              <li className="text-black"> Prepare specific examples from your experience</li>
              <li className="text-black"> Practice with mock interviews to build confidence</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Feedback;