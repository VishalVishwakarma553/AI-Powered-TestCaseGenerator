import React, { useContext } from "react";
import { UserContext } from "../Store/UserContext";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const GitRepoContent = () => {
  const {
    selectedRepo,
    userName,
    selectedFileForTestGeneration,
    setSelectedFileForTestGeneration,
  } = useContext(UserContext);
  const [path, setPath] = useState("");
  const [repoContent, setRepoContent] = useState([]);
  const [codeOfUI, setcodeOfUI] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const fetchContent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/github/repo/getContent`,
          {
            params: { userName, selectedRepo, path },
          }
        );
        if (res?.data?.success) {
          setRepoContent(res.data.content);
          setcodeOfUI({});
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchContent().finally(() => setIsLoading(false));
  }, [path]);

  const fetchCode = async (newPath, fileName) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/github/repo/getContent`,
        {
          params: { userName, selectedRepo, path: newPath },
        }
      );
      const base64String = res.data.content.content;
      const plainString = atob(base64String);
      setcodeOfUI({ ...codeOfUI, fileName: fileName, code: plainString });
      setRepoContent([]);
    } catch (error) {
      console.log("Error in fetchCode", error);
    } finally {
      setIsLoading(false);
    }
  };

  const GoIntoFolder = (folderName) => {
    if (folderName.type === "dir") {
      const currentPath = `${path}/${folderName.name}`;
      setPath(currentPath);
    } else if (folderName.type === "file") {
      const fileExt = folderName.name.split(".").pop().toLowerCase();
      if (
        fileExt.includes("js") ||
        fileExt.includes("jsx") ||
        fileExt.includes("ts") ||
        fileExt.includes("tsx") ||
        fileExt.includes("py") ||
        fileExt.includes("java") ||
        fileExt.includes("html") ||
        fileExt.includes("css")
      ) {
        const newPath = path + `/${folderName.name}`;
        fetchCode(newPath, folderName.name);
      } else {
        toast.error("Please select a valid file");
      }
    }
  };

  const handleAddFileForTestGeneration = (fileName, fileCode) => {
    setSelectedFileForTestGeneration([
      ...selectedFileForTestGeneration,
      { name: fileName, code: fileCode },
    ]);
  };

  const isFileSelected = (fileName, fileCode) => {
    return selectedFileForTestGeneration.some(
      (file) => file.name === fileName && file.code === fileCode
    );
  };

  const handleRemoveFileForTestGeneration = (name) => {
    setSelectedFileForTestGeneration((prev) => {
      return prev.filter((file) => file.name !== name);
    });
  };
  // Todo: Loader not showing for first time
  return (
    <div className="min-h-screen sm:p-4 p-0 pb-2">
      {repoContent.length > 0 && (
        <div className="max-w-6xl flex flex-col gap-2 mx-auto p-4 border border-gray-400 rounded-2xl bg-gray-300">
          <h1 className="text-lg font-semibold">
            Repo Explorer:{" "}
            <span className="font-medium text-sm text-gray-700">
              {userName}/{selectedRepo}/{path}
            </span>
          </h1>
          {
            isLoading?(
              <div className="fixed inset-0 flex items-center justify-center">
        <LoaderCircle className="w-10 h-10 animate-spin mt-5" />
      </div>
            ):(
              <>
              {repoContent.map((repo, idx) => (
            <div
              key={idx}
              onClick={() => GoIntoFolder(repo)}
              className="p-4 border border-gray-400 rounded-2xl bg-gray-200 transition-all duration-200 hover:shadow-lg cursor-pointer"
            >
              {repo.name}
            </div>
          ))}
          <div className="mt-4 flex items-center justify-end">
            {/* <button className="py-2 px-1 bg-gray-600 rounded-lg">Back</button> */}
            <Link to={"/gitRepo/content/testSummary"}>
              <button
                className="py-2 px-1  border border-zinc-500 bg-zinc-400 rounded-lg disabled:cursor-not-allowed font-medium"
                disabled={selectedFileForTestGeneration.length < 1}
              >
                Generate Test Summary
              </button>
            </Link>
          </div>
          </>
            )
          }
        </div>
      )}
      {codeOfUI?.fileName && (
        <>
          <div className="flex justify-between gap-2 items-center">
            <button
              onClick={() => {
                if (isFileSelected(codeOfUI.fileName, codeOfUI.code)) {
                  handleRemoveFileForTestGeneration(codeOfUI.fileName);
                } else {
                  handleAddFileForTestGeneration(
                    codeOfUI.fileName,
                    codeOfUI.code
                  );
                }
              }}
              className="sm:p-2 p-1 rounded-lg border border-zinc-500 font-medium bg-zinc-400 my-2 cursor-pointer hover:bg-zinc-400/80 duration-200"
            >
              {isFileSelected(codeOfUI.fileName, codeOfUI.code)
                ? "Unselect File"
                : "Select File for Test Generation"}
            </button>
            <Link to={"/gitRepo/content/testSummary"}>
              <button
                className="sm:py-2 px-1 py-1  border border-zinc-500 bg-zinc-400 rounded-lg disabled:cursor-not-allowed font-medium cursor-pointer hover:bg-zinc-400/80 transition-all duration-200"
                disabled={selectedFileForTestGeneration.length < 1}
              >
                Generate Test Summary
              </button>
            </Link>
          </div>
          <div
            className={`flex flex-col gap-2 p-4 rounded-lg border  overflow-x-auto transition-all duration-200 ${
              isFileSelected(codeOfUI.fileName, codeOfUI.code)
                ? "border-green-800 bg-green-50/70"
                : "bg-green-50 border-green-500"
            }`}
          >
            <span className="sm:text-xl text-lg text-gray-600 font-semibold">
              {codeOfUI.fileName}
            </span>
            <pre className="text-sm sm:text-[16px]">{codeOfUI.code}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default GitRepoContent;
