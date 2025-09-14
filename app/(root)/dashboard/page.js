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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award,
  Brain,
  Zap,
  BarChart3,
  Calendar,
  Star,
  ChevronRight,
  PlayCircle,
  BookOpen,
  Users,
  Trophy,
  Timer,
  Sparkles,
  ArrowRight,
  Activity,
  CheckCircle,
  FileText,
  Upload,
  Settings,
  Briefcase
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
      title: "Interviews Completed",
      value: userInterview?.length || 0,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-green-600",
      change: "+12%",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      title: "Current Streak",
      value: `${streak?.count || 0} days`,
      icon: Trophy,
      gradient: "from-orange-500 to-red-500",
      change: "+5 days",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Welcome back, {user?.name || 'Candidate'}!
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Your Interview Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your progress, practice with AI, and land your dream job
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          

          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative z-10 p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <PlayCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Start AI Interview</h3>
                    <p className="text-blue-100 mb-4">Practice with our advanced AI interviewer</p>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold group">
                      <Link href="/interview" className="flex items-center gap-2">
                        Start Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Analysis Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative z-10 p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Analyze Resume</h3>
                    <p className="text-green-100 mb-4">Get AI-powered resume feedback</p>
                    <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 font-semibold group">
                      <Link href="/resume/analyser" className="flex items-center gap-2">
                        Upload Resume
                        <Upload className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="space-y-8">
          
          {/* Recent Activity - Full Width */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Recent Interviews</h3>
                <p className="text-gray-600">Your latest interview sessions and results</p>
              </div>
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                <Activity className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            
            {userInterview?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userInterview.slice(0, 6).map((interview, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{interview.role}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(interview.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No interviews yet</h4>
                  <p className="text-gray-500 mb-6">Start your first AI interview to see your progress here</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/interview" className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      Take First Interview
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            

            
            
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Available Interviews</h3>
              <p className="text-gray-600">Practice with real interview scenarios from top companies</p>
            </div>
            {/* <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{allInterviews?.length || 0} available</span>
            </div> */}
          </div>
          
          {allInterviews?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allInterviews.slice(0, 6).map((interview) => (
                <Card key={interview.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {interview.role?.charAt(0) || 'I'}
                        </span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {interview.techStack || 'General'}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">{interview.role}</h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{interview.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </span>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group-hover:scale-105 transition-all">
                        <Link href={`/interview/${interview.id}`} className="flex items-center gap-1">
                          Start
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No interviews available</h4>
                <p className="text-gray-500">Check back later for new opportunities</p>
              </CardContent>
            </Card>
          )}
        </div>

   
      </div>
    </div>
  );
}

export default page;