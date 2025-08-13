import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Store/UserContext";
import { GoogleGenAI } from "@google/genai";
import {LoaderCircle} from "lucide-react"

const TestCode = () => {
  const { selectedSummary } = useContext(UserContext);
  const [testCode, setTestCode] = useState("");
  const [copied, setCopied] = useState(false)
  console.log("Summary", selectedSummary);
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(true)
    const HandleTestCode = () => {
      if (
        !selectedSummary?.code ||
        !selectedSummary?.fileName ||
        !selectedSummary?.summary
      ) {
        toast.error(
          "file name, code, summary are required for code generation"
        );
        return;
      }
      let frameWorkSuggestion = "";
      let fileExt = selectedSummary?.fileName.split(".").pop().toLowerCase();
      if (
        fileExt.includes("js") ||
        fileExt.includes("jsx") ||
        fileExt.includes("ts") ||
        fileExt.includes("tsx")
      ) {
        frameWorkSuggestion = "Generate Jest or React Testing Library Code";
      } else if (fileExt.includes("py")) {
        frameWorkSuggestion = "Generate Pytest code";
      } else if (fileExt.includes("java")) {
        frameWorkSuggestion = "Generate JUnit code";
      } else if (fileExt.includes("html") || fileExt.includes("css")) {
        frameWorkSuggestion =
          "Generate Playwright or Selenium (Python/JS) test code for web interactions";
      } else {
        frameWorkSuggestion =
          "Suggest a suitable testing framework and generate code for it";
      }
      // Gemini api
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      });
      async function main() {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Based on the following code and the test case summary "${selectedSummary?.summary}" and code ${selectedSummary?.code}, generate the complete test case code.
        ${frameWorkSuggestion} Ensure the code is runnable and includes necessary imports and setup.
        Provide only the code block, no additional explanations or markdown outside the code block itself. Do not wrap in backticks unless it's part of the actual code.`,
        });
        // JSON.parse(jsonrepair(response.text))
        console.log("AI Test Code Response", response?.text);
        setTestCode(response?.text);
      }
      main();
    };
    HandleTestCode().finally(() => setIsLoading(false));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(testCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-2 max-w-6xl mx-auto py-4 min-h-screen">
      <h1 className="text-lg font-semibold">Test Code: <span className="text-sm font-medium text-gray-700">{selectedSummary?.fileName || "File"}</span> </h1>
      {
        isLoading?(
          <div className="fixed inset-0 flex items-center justify-center">
        <LoaderCircle className="w-10 h-10 animate-spin mt-5" />
      </div>
        ):(
          <div className="relative overflow-y-auto bg-gray-800 border border-gray-700 p-4 rounded-lg">
        <button onClick={handleCopy} className={`absolute top-2 right-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${copied? "bg-gray-700 text-white": "bg-gray-700 text-gray-200 hover:bg-gray-600"}`}>{copied ? "Copied!": "Copy"}</button>
        <pre className="font-mono text-gray-100">{testCode}</pre>
      </div>
        )
      }
    </div>
  );
};

export default TestCode;
