"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2 } from "lucide-react";

function FileUploader({ userId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!file) {
        toast.error("Please select a file to upload.");
        return;
      }

      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed.");
        return;
      }

      const formData = new FormData();

      formData.set("file", file);
      formData.set("userId", userId);
      setLoading(true);

      const resp = await fetch("/api/resume/analyser", {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        throw new Error("Failed to upload file");
      }
      toast.success("File uploaded successfully!");
      setFile(null);
      const data = await resp.json();
      console.log("Response data:", data);
      router.push(`/resume/${data.id}`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-4 mt-2"
        onSubmit={onSubmitHandler}
      >
        <div className="space-y-2">
          <Label htmlFor="file" className="text-sm font-medium text-zinc-700">
            Resume (PDF)
          </Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <FileText className="w-4 h-4 text-zinc-400 group-hover:text-zinc-500 transition-colors" />
            </div>
            <Input
              id="file"
              type="file"
              accept=".pdf"
              className="pl-10 h-11 border-zinc-200 focus:border-zinc-400 focus:ring-0 transition-all bg-white cursor-pointer file:cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </div>
          <p className="text-[11px] text-zinc-400">Maximum file size: 5MB. PDF only.</p>
        </div>

        <Button 
          type="submit" 
          disabled={loading || !file} 
          className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-all"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Start Analysis</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}

export default FileUploader;
