"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

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
    <>
      <form
        className="grid w-full max-w-sm items-center gap-3 mt-5"
        onSubmit={onSubmitHandler}
      >
        <Label htmlFor="resume" className="font-medium">
          Upload Resume
        </Label>
        <Input
          id="file"
          type="file"
          className="mt-2"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </>
  );
}

export default FileUploader;
