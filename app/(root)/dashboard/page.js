import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "../../../lib/actions/auth.action";
import {
  getAllInterviews,
  getStreakCount,
  getUserInterview,
} from "../../../lib/actions/general.action";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PlayCircle,
  FileText,
  Upload,
  Calendar,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  Flame,
  ArrowRight
} from "lucide-react";

async function page() {
  const user = await getCurrentUser();

  const [userInterview, allInterviews, streak] = await Promise.all([
    await getUserInterview(user?.uid),
    await getAllInterviews(),
    await getStreakCount(user?.uid),
  ]);

  const stats = [
    {
      title: "Completed",
      value: userInterview?.length || 0,
      icon: CheckCircle2,
      label: "Interviews",
    },
    {
      title: "Current Streak",
      value: `${streak?.count || 0}`,
      icon: Flame,
      label: "Days",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-500 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight">
              Dashboard
            </h1>
          </div>
          
          <div className="flex gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="flex items-center gap-3 bg-white border border-zinc-200 rounded-lg px-4 py-3 shadow-sm">
                  <div className="p-2 bg-zinc-100 rounded-md">
                    <IconComponent className="w-4 h-4 text-zinc-700" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">{stat.title}</p>
                    <p className="text-lg font-semibold text-zinc-900 leading-none mt-1">
                      {stat.value} <span className="text-xs font-normal text-zinc-500">{stat.label}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Interview Card */}
          <Card className="border border-zinc-200 shadow-sm bg-white overflow-hidden transition-all hover:border-zinc-300">
            <CardContent className="p-0">
              <div className="p-8 flex flex-col h-full justify-between space-y-8">
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
                    <PlayCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-1">New AI Interview</h3>
                    <p className="text-zinc-500 text-sm">Configure a practice session with our AI interviewer for any role.</p>
                  </div>
                </div>
                <Button asChild className="w-full sm:w-auto bg-zinc-900 text-white hover:bg-zinc-800 self-start group">
                  <Link href="/interview">
                    Configure Session
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resume Analysis Card */}
          <Card className="border border-zinc-200 shadow-sm bg-white overflow-hidden transition-all hover:border-zinc-300">
            <CardContent className="p-0">
              <div className="p-8 flex flex-col h-full justify-between space-y-8">
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-1">Resume Analysis</h3>
                    <p className="text-zinc-500 text-sm">Upload your resume to get instant, actionable feedback and scoring.</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full sm:w-auto self-start group">
                  <Link href="/resume/analyser">
                    <Upload className="w-4 h-4 mr-2 text-zinc-500" />
                    Upload Resume
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border-t border-zinc-200 pt-12"></div>

        {/* Recent Interviews */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Your Recent Interviews</h3>
            <Link href="/interviews" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              View all history
            </Link>
          </div>
          
          {userInterview?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userInterview.slice(0, 6).map((interview, index) => (
                <Link key={index} href={`/interview/${interview.id}`} className="group block">
                  <Card className="border border-zinc-200 shadow-sm hover:border-zinc-300 hover:shadow transition-all bg-white">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-zinc-600" />
                        </div>
                        <span className="text-xs font-medium text-zinc-400">
                          {new Date(interview.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <h4 className="font-medium text-zinc-900 mb-1 group-hover:text-zinc-700 transition-colors">
                        {interview.role}
                      </h4>
                      <p className="text-sm text-zinc-500 mb-4 line-clamp-1">
                        Level: <span className="capitalize">{interview.level || "Standard"}</span> • {interview.techstack || "General"}
                      </p>
                      <div className="flex items-center text-xs font-medium text-zinc-900">
                        View Details
                        <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-zinc-300 rounded-xl p-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-zinc-400" />
              </div>
              <h4 className="text-base font-medium text-zinc-900 mb-1">No interviews yet</h4>
              <p className="text-sm text-zinc-500 mb-6 max-w-sm">
                You haven't completed any interviews yet. Start a new session to begin tracking your performance.
              </p>
              <Button asChild className="bg-zinc-900 text-white hover:bg-zinc-800">
                <Link href="/interview">
                  Start First Interview
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Recommended Scenarios */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Available Scenarios</h3>
            <span className="text-sm font-medium text-zinc-500">
              {allInterviews?.length || 0} total
            </span>
          </div>
          
          {allInterviews?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allInterviews.slice(0, 8).map((interview) => (
                <Link key={interview.id} href={`/interview/${interview.id}`} className="group block">
                  <Card className="border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all bg-white h-full flex flex-col">
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 font-normal border-transparent">
                          {interview.techStack || 'General'}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-zinc-900 text-sm mb-2">{interview.role}</h4>
                      <p className="text-xs text-zinc-500 line-clamp-2 mb-4 flex-1">{interview.description}</p>
                      
                      <div className="flex items-center text-xs font-medium text-zinc-500 mt-auto">
                        Practice scenario
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:text-zinc-900 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center">
              <p className="text-sm text-zinc-500">No public scenarios available right now.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default page;