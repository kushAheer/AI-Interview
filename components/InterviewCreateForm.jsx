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

function InterviewCreateForm() {
  return (
    <>
      <Card className="p-4 shadow-lg flex flex-col border-2 w-100 pt-4">
        <div className="flex flex-col items-center mb-4 justify-center">
          <h1 className="text-3xl font-bold mb-4">Create New Interview</h1>
          <p className="text-1xl font-bold">Practice Job Interview</p>
        </div>
        <form className="flex flex-col gap-4">
          <div className="form-item">
            <Label htmlFor="title" className="block mb-2">
              What Type of Interview would you like to Practice
            </Label>
            <Select>
              <SelectTrigger className="w-full">
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
          <div className="form-item">
            <Label htmlFor="date" className="block mb-2">
              What role are you Focusing On ?
            </Label>
            <Input type={"text"} placeholder="Select Your Role" />
          </div>
          <div className="form-item">
            <Label htmlFor="description" className="block mb-2">
              Which Tech Stack are you Focus on ?
            </Label>
            <Input
              type={"text"}
              placeholder="Select Your Prefered Tech Stack"
            />
          </div>
          <div className="form-item">
            <Label htmlFor="description" className="block mb-2">
              How long would you like the interview would be ?
            </Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Interview Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10min">10 min</SelectItem>
                <SelectItem value="15min">15 min</SelectItem>
                <SelectItem value="30min">30 min</SelectItem>
                <SelectItem value="1hr">1 Hour </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full btn-primary" type="submit">
            Start Interview
          </Button>
        </form>
      </Card>
    </>
  );
}

export default InterviewCreateForm;
