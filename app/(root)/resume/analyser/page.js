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
      description: "Ensure your resume passes through Applicant Tracking Systems."
    },
    {
      icon: Target,
      title: "Skills Analysis",
      description: "Identify missing keywords and skills for your target role."
    },
    {
      icon: TrendingUp,
      title: "Impact Scoring",
      description: "Get a comprehensive score breakdown based on industry standards."
    },
    {
      icon: Sparkles,
      title: "AI Suggestions",
      description: "Actionable recommendations to improve clarity and impact."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col selection:bg-zinc-200 pb-24">
      {/* Header Section */}
      <div className="w-full bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-600 rounded-full text-xs font-medium mb-6">
            <Brain className="w-3.5 h-3.5" />
            <span>AI-Powered Intelligence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-6 tracking-tight">
            Resume Analyzer
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Upload your resume and get instant AI-powered feedback to optimize it for your dream job. 
            Stand out with data-driven insights.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Upload Section */}
          <div className="lg:col-span-2">
            <Card className="border border-zinc-200 shadow-sm bg-white overflow-hidden">
              <div className="p-8 border-b border-zinc-100 bg-zinc-50/30">
                <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-zinc-900" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Upload Resume</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  We support PDF format for the most accurate analysis.
                </p>
              </div>
              <CardContent className="p-8">
                <FileUploader userId={user?.uid} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-zinc-200 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-zinc-900 uppercase tracking-wider">
                  <Star className="w-4 h-4 text-zinc-400" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Keep your resume to 1-2 pages",
                  "Quantify your achievements",
                  "Tailor for specific job roles"
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-zinc-600 font-medium leading-tight">
                      {tip}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-zinc-200 shadow-sm bg-zinc-900 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-zinc-400 uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Speed", value: "< 30s" },
                  { label: "Accuracy", value: "95%+" },
                  { label: "Format", value: "PDF" }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs text-zinc-400 font-medium">{stat.label}</span>
                    <span className="text-xs text-white font-bold">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">Key Capabilities</h2>
            <p className="text-zinc-500 text-sm font-medium">Actionable insights to refine your application.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all bg-white group">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-zinc-100 transition-colors">
                      <IconComponent className="w-5 h-5 text-zinc-900" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 mb-2 tracking-tight uppercase">{feature.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
export const dynamic = 'force-dynamic';