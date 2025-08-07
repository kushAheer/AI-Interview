import React from "react";
import FileUploader from "@/components/FileUploader";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";


async function page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Resume Analyser</h1>
      <FileUploader userId={user?.uid} />
    </div>
  );
}

export default page;
export const dynamic = 'force-dynamic';