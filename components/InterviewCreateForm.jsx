"use client";
import React from "react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Sparkles, Briefcase } from "lucide-react";

function InterviewCreateForm() {
  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-xl w-full p-8 shadow-sm border border-zinc-200 bg-white">
        
        <div className="flex flex-col items-center mb-8 justify-center text-center">
          <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
            <Briefcase className="w-6 h-6 text-zinc-900" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">Configure Practice Session</h1>
          <p className="text-sm text-zinc-500">
            Set up your AI mock interview to match your target role.
          </p>
        </div>

        <form className="flex flex-col gap-6">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-zinc-700">
              Interview Type
            </Label>
            <Select>
              <SelectTrigger className="w-full bg-white border-zinc-200">
                <SelectValue placeholder="Select Interview Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="case-study">Case Study</SelectItem>
                <SelectItem value="mock">Mock Interview</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-zinc-700">
              Target Role
            </Label>
            <Input 
              id="role"
              type="text" 
              placeholder="e.g. Frontend Developer, Product Manager" 
              className="bg-white border-zinc-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="techstack" className="text-sm font-medium text-zinc-700">
              Tech Stack & Focus Areas
            </Label>
            <Input
              id="techstack"
              type="text"
              placeholder="e.g. React, Node.js, System Design"
              className="bg-white border-zinc-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium text-zinc-700">
              Preferred Duration
            </Label>
            <Select>
              <SelectTrigger className="w-full bg-white border-zinc-200">
                <SelectValue placeholder="Select Interview Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10min">10 Minutes</SelectItem>
                <SelectItem value="15min">15 Minutes</SelectItem>
                <SelectItem value="30min">30 Minutes</SelectItem>
                <SelectItem value="1hr">1 Hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white mt-4 h-11" type="submit">
            <Sparkles className="w-4 h-4 mr-2" />
            Start Session
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default InterviewCreateForm;
