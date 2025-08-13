import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./Components/HomePage";
import GitRepo from "./Components/GitRepo";
import { Toaster } from "react-hot-toast";
import { UserContext } from "./Store/UserContext";
import { ArrowRight, WandSparkles } from "lucide-react";
import GitRepoContent from "./Components/GitRepoContent";
import TestSummary from "./Components/TestSummary";
import TestCode from "./Components/TestCode";

function App() {
  const [userName, setUserName] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedFileForTestGeneration, setSelectedFileForTestGeneration] =
    useState([]);
  const [selectedSummary, setSelectedSummary] = useState({fileName: "", summary: "", code: ""})
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const userFromURL = urlParams.get("user");
    if (userFromURL) {
      setUserName(userFromURL);
    }
    if (code) {
      // Send the code to your backend
      const sendCodeToBackend = async () => {
        try {
          await axios.get(
            `http://localhost:5000/api/github/callback?code=${code}`
          );
        } catch (error) {
          console.error("Error sending code to backend:", error);
        }
      };
      sendCodeToBackend();
    }
  }, []);

  const githubLogin = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/github/login");
      // To redirect on sent login url from backend
      window.location.href = res.data.url;
    } catch (error) {
      console.log("LoginHandler", error);
    }
  };
  return (
    <UserContext.Provider
      value={{
        userName: userName,
        setUserName,
        selectedRepo,
        setSelectedRepo,
        selectedFileForTestGeneration,
        setSelectedFileForTestGeneration,
        selectedSummary,
        setSelectedSummary
      }}
    >
      <div className="bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 px-4 sm:px-6 lg:px-8">
        {/* Navbar */}
        <div className="h-22 flex justify-between items-center  ">
          <h1 className="flex items-center sm:gap-6 gap-4">
            <WandSparkles className="sm:w-10 sm:h-10 w-8 h-8" />{" "}
            <span className="sm:text-xl text-lg font-semibold">AI Powered</span>
          </h1>
          <button
            onClick={githubLogin}
            className="flex items-center p-1 sm:p-2 bg-zinc-400 cursor-pointer text-zinc-800 py-1 rounded-lg border border-gray-300"
          >
            <span className="sm:text-lg font-medium">
              {!userName ? "Login" : userName}
            </span>
            {!userName ? <ArrowRight className="sm:w-6 sm:h-6 w-5 h-5" /> : ""}
          </button>
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gitRepo" element={<GitRepo />} />
          <Route path="/gitRepo/content" element={<GitRepoContent />} />
          <Route path="/gitRepo/content/testSummary" element={<TestSummary />} />
          <Route path="/gitRepo/content/testSummary/testCode" element={<TestCode />} />
        </Routes>
        <Toaster />
      </div>
    </UserContext.Provider>
  );
}

export default App;
