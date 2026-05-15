import {
  Brain,
  Target,
  CheckCircle,
  FileText,
  ArrowRight,
  TrendingUp,
  PlayCircle,
  ChevronRight,
  Zap,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Interviews",
      description: "Practice with advanced AI that simulates real interview scenarios with dynamic follow-ups."
    },
    {
      icon: Target,
      title: "Personalized Feedback",
      description: "Get detailed, actionable feedback on your responses and communication skills."
    },
    {
      icon: FileText,
      title: "Resume Analysis",
      description: "Optimize your resume with AI-powered suggestions and ATS compatibility scoring."
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and historical insights."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 selection:bg-zinc-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-32">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>Introducing HireSmart AI</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-900 mb-8 tracking-tight leading-[1.1]">
              Master your next <br className="hidden sm:block" />
              <span className="text-zinc-500">interview with AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-500 mb-12 leading-relaxed">
              Practice with dynamic AI mock interviews, get instant actionable feedback, and optimize your resume to land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-8 h-14 rounded-full group"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Start Practicing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900 font-medium px-8 h-14 rounded-full"
              >
                <Link href="/resume/analyser" className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Analyze Resume
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">
              Everything you need to excel
            </h2>
            <p className="text-lg text-zinc-500 max-w-2xl">
              Our comprehensive suite of tools ensures you are fully prepared for any interview scenario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors bg-white">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="w-5 h-5 text-zinc-900" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white border-y border-zinc-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
              Get interview-ready in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-zinc-900 font-semibold text-sm">01</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Configure Scenario</h3>
              <p className="text-sm text-zinc-500">
                Select your target role, experience level, and preferred tech stack.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-zinc-900 font-semibold text-sm">02</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Engage with AI</h3>
              <p className="text-sm text-zinc-500">
                Have a realistic voice conversation with our advanced interviewer.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-zinc-900 font-semibold text-sm">03</span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Review Feedback</h3>
              <p className="text-sm text-zinc-500">
                Get scored on your technical knowledge, clarity, and confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-zinc-900 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
            Ready to land your dream job?
          </h2>
          <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
            Join professionals who have successfully improved their interview skills with HireSmart.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-zinc-900 hover:bg-zinc-100 font-medium px-8 h-14 rounded-full"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}