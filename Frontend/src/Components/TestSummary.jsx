import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";
import { UserContext } from "../Store/UserContext";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const TestSummary = () => {
  const { selectedSummary, setSelectedSummary, selectedFileForTestGeneration } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [testSummary, setTestSummary] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    const handleTestSummaryGeneration = async () => {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      });

      async function generateSummary(file) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a test case generator. Given a file name and its code, generate 2-3 distinct high-level test case summaries for the code.
          Focus on different aspects like functionality, edge cases, integration, or performance.
          For example, if it's a React component, suggest summaries for rendering, state updates, prop handling, or user interaction.
          If it's a Python function, suggest summaries for valid inputs, invalid inputs, boundary conditions, or side effects.
          The response should be a JSON array of objects, where each object has a "summary" key. Do not use backticks.
          Example:
          \`\`\`json
          [
            { "summary": "Test rendering of the component with default props" },
            { "summary": "Test handling of invalid input" }
          ]
          \`\`\`
          Here's the file name: ${file.name}
          Here's the code:\n\`\`\`\n${file.code}\n\`\`\`
          `,
          });
          try {
            const aiResponse = JSON.parse(jsonrepair(response.text));
            setTestSummary((prevSummaies) => [
              ...prevSummaies,
              { fileName: file.name, AiResponse: aiResponse, parsing: true },
            ]);
          } catch (parseError) {
            toast.error(`Error parsing AI response for ${file.name} as JSON:`);
            setTestSummary([
              ...testSummary,
              {
                fileName: file.name,
                AiResponse: response.text,
                parsing: false,
              },
            ]);
          }
        } catch (aiError) {
          console.log("Gemini AI error, Please try after some time");
        }
      }

      // Process each file individually
      await Promise.all(
        selectedFileForTestGeneration.map((file) => generateSummary(file))
      );
    };
    handleTestSummaryGeneration().finally(() => setIsLoading(false));
  }, []);
  return (
    <div className=" max-w-6xl mx-auto py-6 px-2 min-h-screen">
      <h1 className="sm:text-3xl text-2xl font-bold mb-8 text-gray-800">
        Test Case Summaries
      </h1>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <LoaderCircle className="w-10 h-10 animate-spin mt-5" />
        </div>
      ) : (
        <div className=" p-4 border border-gray-400 rounded-2xl bg-gray-300">
          <div className="flex flex-col gap-8">
            {testSummary.length > 0 &&
              testSummary.map((items, idx) => (
                <div key={idx}>
                  {items.parsing ? (
                    <div className="flex flex-col gap-2">
                      <h1 className="text-lg font-semibold ">
                        Test Summary for {items.fileName}
                      </h1>
                      {items.AiResponse.map((summary, index) => (
                        <div
                          onClick={() =>
                            setSelectedSummary({
                              fileName: items.fileName,
                              summary: summary.summary,
                              code: selectedFileForTestGeneration.find(
                                (file) => file.name === items.fileName
                              )?.code,
                            })
                          }
                          key={index}
                          className={`p-4 border  rounded-2xl  transition-all duration-200 hover:shadow-lg cursor-pointer  ${
                            selectedSummary.summary.includes(summary.summary)
                              ? "border-green-400 bg-green-200"
                              : "border-gray-400 bg-gray-200"
                          }`}
                        >
                          <p className="text-shadow-black">{summary.summary}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <h1 className="text-lg font-semibold">
                        Test Summary for {items.fileName}
                      </h1>
                      <div className="p-4 border border-gray-800">
                        {items.AiResponse}
                      </div>
                    </>
                  )}
                </div>
              ))}{" "}
            <Link to="/gitRepo/content/testSummary/testCode">
              <button
                disabled={selectedSummary.length < 1}
                className="py-2 px-1  border border-zinc-500 bg-zinc-400 rounded-lg disabled:cursor-not-allowed font-medium cursor-pointer"
              >
                Generate Code
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSummary;
