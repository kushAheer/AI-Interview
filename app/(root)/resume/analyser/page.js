import React from "react";
import FileUploader from "@/components/FileUploader";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Star, 
  Zap, 
  Target,
  TrendingUp,
  Brain,
  Sparkles
} from "lucide-react";

async function page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const features = [
    {
      icon: CheckCircle,
      title: "ATS Optimization",
      description: "Check if your resume passes Applicant Tracking Systems"
    },
    {
      icon: Target,
      title: "Skills Analysis",
      description: "Identify missing skills and keywords for your target role"
    },
    {
      icon: TrendingUp,
      title: "Impact Score",
      description: "Get a detailed score breakdown of your resume"
    },
    {
      icon: Sparkles,
      title: "AI Suggestions",
      description: "Receive personalized recommendations to improve your resume"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            AI-Powered Analysis
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload your resume and get instant AI-powered feedback to optimize it for your dream job. 
            Our advanced analysis helps you stand out from the competition.
          </p>
        </div>

        {/* Main Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Upload Card - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Upload Your Resume</CardTitle>
                <p className="text-gray-600">
                  Drag and drop your resume or click to browse. We support PDF, DOC, and DOCX formats.
                </p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <FileUploader userId={user?.uid} />
              </CardContent>
            </Card>
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <Star className="w-5 h-5" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-yellow-700">
                    Keep your resume to 1-2 pages for optimal readability
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-yellow-700">
                    Use action verbs and quantify your achievements
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-yellow-700">
                    Tailor your resume for each job application
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Zap className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Analysis Speed</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    &lt; 30 seconds
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Accuracy Rate</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    95%+
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Formats Supported</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    PDF, DOC, DOCX
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You'll Get
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive analysis provides actionable insights to make your resume stand out
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How It Works Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-semibold">Upload Resume</h4>
                <p className="text-gray-300 text-sm">
                  Upload your resume in PDF, DOC, or DOCX format
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-semibold">AI Analysis</h4>
                <p className="text-gray-300 text-sm">
                  Our AI analyzes content, format, and ATS compatibility
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-semibold">Get Insights</h4>
                <p className="text-gray-300 text-sm">
                  Receive detailed feedback and improvement suggestions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default page;
export const dynamic = 'force-dynamic';