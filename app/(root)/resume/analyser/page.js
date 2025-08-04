import React from "react";
import FileUploadComponent from "@/components/FileUploader";

function page() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* <h1 className="text-5xl font-bold">Resume Analyser</h1> */}
      <FileUploadComponent />
    </div>
  );
}

export default page;
