import React from "react";

function Output({ outputData }) {
  return (
    <>
      <div className="h-full  text-white flex flex-col">
        <div className="px-4 py-2 border-b border-gray-700">
          <h3 className="text-sm font-bold">Output</h3>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <pre className="text-sm">{outputData || "No output available"}</pre>
        </div>
      </div>
    </>
  );
}

export default Output;
