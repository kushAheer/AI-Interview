"use client";
import React, { useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "@/constants";
import { Button } from "./ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Output from "./Output";
import toast from "react-hot-toast";
import { LANGUAGES } from "@/constants";

function Editor() {
  const [language, setLanguage] = useState("cpp");
  const [value, setValue] = useState("// Write your code here...");
  const [outputData, setOutputData] = useState("");

  const editorRef = useRef(null);

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setValue(CODE_SNIPPETS[value] || "// Write your code here...");
  };

  const handleEditorChange = (value) => {
    setValue(value);
  };

  const onMountHandler = (editor) => {
    editorRef.current = editor; //store editor instance
    editor.focus();
  };

  const onRunClick = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode.trim()) {
      toast.error("Please write some code before running!");
      return;
    }
    try {
      const contentData = {
        language: language,
        version: LANGUAGES[language],
        files: [
          {
            content: sourceCode,
          },
        ],
      };

      const resp = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contentData),
      });

      const resData = await resp.json();
      console.log(resData);
      setOutputData(resData.run.output);
    } catch (error) {
      toast.error(error.message || "An error occurred while running the code.");
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-full ">
      <ResizablePanel defaultSize={40} minSize={20} maxSize={70}>
        <div className="h-full p-4 border-r overflow-auto">
          <h2 className="text-xl font-bold mb-4">Problem Statement</h2>
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-2">Two Sum</h3>
            <p className="mb-4">
              Given an array of integers <code>nums</code> and an integer{" "}
              <code>target</code>, return indices of the two numbers such that
              they add up to target.
            </p>
            <p className="mb-4">
              You may assume that each input would have exactly one solution,
              and you may not use the same element twice.
            </p>
            <p className="mb-4">You can return the answer in any order.</p>

            <div className=" p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Example 1:</h4>
              <pre className="text-sm">
                {`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
              </pre>
            </div>
            <div className=" p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Example 2:</h4>
              <pre className="text-sm">
                {`Input: nums = [3,2,4], target = 6
Output: [1,2]`}
              </pre>
            </div>

            <div className=" p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Constraints:</h4>
              <ul className="text-sm space-y-1">
                <li>• 2 ≤ nums.length ≤ 10⁴</li>
                <li>• -10⁹ ≤ nums[i] ≤ 10⁹</li>
                <li>• -10⁹ ≤ target ≤ 10⁹</li>
                <li>• Only one valid answer exists.</li>
              </ul>
            </div>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={60} minSize={30}>
        <ResizablePanelGroup direction="vertical" className="h-full">
          <ResizablePanel defaultSize={75} minSize={50}>
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-300">
                <LanguageSelector onLanguageChange={handleLanguageChange} />
                <div className="flex gap-4">
                  <Button onClick={onRunClick} variant="outline">
                    Run
                  </Button>
                  <Button>Submit</Button>
                </div>
              </div>

              <div className="flex-1">
                <MonacoEditor
                  height="100%"
                  language={language}
                  width="100%"
                  value={value}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    selectOnLineNumbers: true,
                    automaticLayout: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollbar: {
                      vertical: "visible",
                      horizontal: "visible",
                    },
                  }}
                  onMount={onMountHandler}
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
            <Output outputData={outputData} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default Editor;
