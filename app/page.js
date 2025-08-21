import {
  Brain,
  Target,
  CheckCircle,
  Star,
  Zap,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="container mx-auto mt-12">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <div className="w-40 h-40 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center  justify-center mb-8 relative">
            <Brain className="w-20 h-20 mx-auto" />
            <div className="top-0 right-0 absolute ">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary/80 bg-red-500/20 text-red-400 border-red-500/30">
                <Target className="w-4 h-4 mr-1" />
                HTML
              </span>
            </div>
            <div className="absolute left-[98%]">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary/80 bg-orange-500/20 text-orange-400 border-orange-500/30">
                <FileText className="w-4 h-4 mr-1" />
                PHP
              </span>
            </div>
            <div className="absolute bottom-0 right-0">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary/80 bg-red-500/20 text-red-400 border-red-500/30">
                <Zap className="w-4 h-4 mr-1" />
                CSS
              </span>
            </div>
            <div className="absolute bottom-0 left-0">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary/80 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                <Star className="w-4 h-4 mr-1" />
                JS
              </span>
            </div>
            <div className="absolute right-[98%]">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary/80 bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Brain className="w-4 h-4 mr-1" />
                REACT
              </span>
            </div>
            <div className="absolute top-0 left-0">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary/80 bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-4 h-4 mr-1" />
                AI
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get Interview Ready with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                AI-Powered
                <br /> Practice
              </span>
              <br />
              and Feedback
            </h1>
            <p className="text-gray-400 text-xl mb-8 max-w-3xl mx-auto">
              Practice Real Interview Questions, Get AI Feedback, and Get Resume
              Feedback to Land Your Dream Job.
            </p>
          </div>
          <div className="flex w-full max-w-md flex-col mb-4 items-center justify-center gap-4 px-4 sm:max-w-none sm:flex-row sm:px-0">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 px-8 py-6 text-lg text-white hover:from-purple-600 hover:to-blue-700 sm:w-auto"
            >
              <Link href="/dashboard">Start Practicing</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-gray-600 px-8 py-6 text-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 sm:w-auto"
            >
              <Link href="/resume/analyser">
                <ArrowRight className="mr-2 h-5 w-5" />
                Resume Analyser
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
