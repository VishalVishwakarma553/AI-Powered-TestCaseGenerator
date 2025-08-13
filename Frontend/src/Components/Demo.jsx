// import axios from "axios";
// import { useState } from "react";
// import { data, useSearchParams } from "react-router-dom";
// import { GoogleGenAI } from "@google/genai";
// import { jsonrepair } from "jsonrepair";

// const Demo = () => {
//   const [searchParams] = useSearchParams();
//   const userName = searchParams.get("user");
//   const [allRepo, setAllRepo] = useState([]);
//   const [selectedRepo, setSelectedRepo] = useState("");
//   const [selectedRepoFile, setSelectedRepoFile] = useState([]);
//   const [fileSelect, setFileSelect] = useState("");
//   const [AiResponse, setAiResponse] = useState([]);
//   const [repoCode, setRepoCode] = useState("");
//   const githubLogin = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/github/login");
//       // To redirect on sent login url from backend
//       window.location.href = res.data.url;
//     } catch (error) {
//       console.log("LoginHandler", error);
//     }
//   };
//   const getRepository = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/github/repo?user=${userName}`
//       );
//       console.log(res);
//       setAllRepo(res.data.allRepo);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const getFile = async () => {
//     try {
//       const res = await axios.get(
//         `https://api.github.com/repos/${userName}/${selectedRepo}/contents/`
//       );
//       console.log("Repo code", res);
//       setSelectedRepoFile(res.data);
//     } catch (error) {
//       console.log("Error in code file", error);
//     }
//   };
//   const getCode = async () => {
//     try {
//       const res = await axios.get(
//         `https://api.github.com/repos/${userName}/${selectedRepo}/contents/${fileSelect} `
//       );
//       console.log("Code", res);
//       const base64String = res.data.content;
//       const plainString = atob(base64String);
//       setRepoCode(plainString);
//       // Gemini api
//       const ai = new GoogleGenAI({
//         apiKey: "AIzaSyAw9C_F4pfzl27pTkMgqf_fgp9v7FVZzwE",
//       });

//       async function main() {
//         const response = await ai.models.generateContent({
//           model: "gemini-2.5-flash",
//           contents: `Given the following code from a software project, suggest a few distinct high-level test case summaries.
//         Focus on different aspects like functionality, edge cases, integration, or performance.
//         For example, if it's a React component, suggest summaries for rendering, state updates, prop handling, or user interaction.
//         If it's a Python function, suggest summaries for valid inputs, invalid inputs, boundary conditions, or side effects.
//         Present each summary as a concise phrase or sentence and provide the response in the form of json. 
//         Make sure the summaries are distinct and cover different testing angles.
//           ${plainString}
//           `,
//         });
//         console.log("AI Response", JSON.parse(jsonrepair(response.text)));
//         setAiResponse(JSON.parse(jsonrepair(response.text)));
//       }
//       main();

//       console.log("String", plainString);
//     } catch (error) {
//       console.log("Error in get code", error);
//     }
//   };

//   const HandleTestCode = () => {
//     const summaryData = AiResponse[0];
//     let frameWorkSuggestion = "";
//     let fileExt = fileSelect.split(".").pop().toLowerCase();
//     if (
//       fileExt.includes("js") ||
//       fileExt.includes("jsx") ||
//       fileExt.includes("ts") ||
//       fileExt.includes("tsx")
//     ) {
//       frameWorkSuggestion = "Generate Jest or React Testing Library Code";
//     } else if (fileExt.includes("py")) {
//       frameWorkSuggestion = "Generate Pytest code";
//     } else if (fileExt.includes("java")) {
//       frameWorkSuggestion = "Generate JUnit code";
//     } else if (fileExt.includes("html") || fileExt.includes("css")) {
//       frameWorkSuggestion =
//         "Generate Playwright or Selenium (Python/JS) test code for web interactions";
//     } else {
//       frameWorkSuggestion =
//         "Suggest a suitable testing framework and generate code for it";
//     }
//     // Gemini api
//     const ai = new GoogleGenAI({
//       apiKey: "AIzaSyAw9C_F4pfzl27pTkMgqf_fgp9v7FVZzwE",
//     });
//     async function main() {
//       const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: `Based on the following code and the test case summary "${summaryData}" and code ${repoCode}, generate the complete test case code.
//         ${frameWorkSuggestion} Ensure the code is runnable and includes necessary imports and setup.
//         Provide only the code block, no additional explanations or markdown outside the code block itself. Do not wrap in backticks unless it's part of the actual code.`,
//       });
//       // JSON.parse(jsonrepair(response.text))
//       console.log(
//         "AI Test Code Response",
//         response.text
//       );
//     }
//     main();
//   };
//   return (
//     <>
//       <div className="flex gap-8 m-8">
//         <button
//           onClick={githubLogin}
//           className="bg-gray-500 p-4 border-gray-700 hover:bg-gray-600 duration-200 rounded-lg cursor-pointer text-white"
//         >
//           Login with github
//         </button>
//         <button
//           onClick={getRepository}
//           className="bg-gray-500 p-4 border-gray-700 hover:bg-gray-600 duration-200 rounded-lg cursor-pointer text-white"
//         >
//           Repo of github
//         </button>
//       </div>
//       <div className="flex gap-8">
//         <select onChange={(e) => setSelectedRepo(e.target.value)}>
//           {allRepo.map((repos) => (
//             <option key={repos.id} value={repos.name}>
//               {repos.name}
//             </option>
//           ))}
//         </select>
//         <button
//           onClick={getFile}
//           className="bg-gray-500 p-4 border-gray-700 hover:bg-gray-600 duration-200 rounded-lg cursor-pointer text-white"
//         >
//           File of repo
//         </button>
//       </div>
//       <div className="mt-8">
//         <select
//           onChange={(e) => {
//             setFileSelect(e.target.value);
//             console.log(fileSelect);
//           }}
//         >
//           {selectedRepoFile.map((repoFile, idx) => (
//             <option key={idx} value={repoFile.name}>
//               {repoFile.name}
//             </option>
//           ))}
//         </select>
//         <button
//           onClick={getCode}
//           className="bg-gray-500 p-4 border-gray-700 hover:bg-gray-600 duration-200 rounded-lg cursor-pointer text-white"
//         >
//           code of file
//         </button>
//         <button
//           onClick={HandleTestCode}
//           className="bg-gray-500 p-4 border-gray-700 hover:bg-gray-600 duration-200 rounded-lg cursor-pointer text-white ml-6"
//         >
//           Gene Test Code
//         </button>
//       </div>
//     </>
//   );
// };
// export default Demo;
