import {
  Brain,
  Target,
  CheckCircle,
  Star,
  Zap,
  FileText,
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  PlayCircle,
  Sparkles,
  ChevronRight,
  BarChart3
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
      description: "Practice with advanced AI that simulates real interview scenarios"
    },
    {
      icon: Target,
      title: "Personalized Feedback",
      description: "Get detailed feedback on your responses and communication skills"
    },
    {
      icon: FileText,
      title: "Resume Analysis",
      description: "Optimize your resume with AI-powered suggestions and ATS compatibility"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and insights"
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Master Your Next
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Interview with AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Practice with AI-powered mock interviews, get instant feedback, and optimize your resume. 
              Join thousands of professionals who landed their dream jobs with HireSmart.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg group"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Start Practicing Now
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg"
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose HireSmart?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides everything you need to excel in your next interview
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-24 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powered by Advanced Technology</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built with cutting-edge AI and modern web technologies for the best user experience
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6">
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-2 text-sm">
              <Brain className="w-4 h-4 mr-2" />
              Machine Learning
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-2 text-sm">
              <Target className="w-4 h-4 mr-2" />
              Natural Language Processing
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-2 text-sm">
              <FileText className="w-4 h-4 mr-2" />
              Resume Parsing
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Real-time Analysis
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-2" />
              Speech Recognition
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-2 text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Sentiment Analysis
            </Badge>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get interview-ready in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Your Role</h3>
              <p className="text-gray-600">
                Select from hundreds of interview scenarios tailored to your target position
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Practice with AI</h3>
              <p className="text-gray-600">
                Engage in realistic mock interviews with our advanced AI interviewer
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Feedback</h3>
              <p className="text-gray-600">
                Receive detailed analysis and personalized recommendations to improve
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have successfully improved their interview skills with HireSmart
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}