import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../Store/UserContext";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const GitRepo = () => {
  const [allRepo, setAllRepo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userName, setSelectedRepo } = useContext(UserContext);
  useEffect(() => {
    const getRepository = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/github/repo?user=${userName}`
        );
        setAllRepo(res.data.allRepo);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getRepository();
  }, []);
  console.log(allRepo)
  return (
    <div className="sm:p-6 p-0 mt-4 sm:mt-0 min-h-screen">
      <h1 className="sm:text-3xl text-xl font-bold mb-8 text-gray-800">
        Your GitHub Repositories
      </h1>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <LoaderCircle className="w-10 h-10 animate-spin mt-5" />
        </div>
      ) : (
        <div className="max-w-6xl flex flex-col gap-2 mx-auto p-4 border border-gray-400 rounded-2xl bg-gray-300">
          {allRepo.length > 0 &&
            allRepo.map((repo, idx) => (
              <Link to={"/gitRepo/content"} key={idx}>
                <div
                  onClick={() => setSelectedRepo(repo.name)}
                  className="p-4 border border-gray-400 rounded-2xl bg-gray-200 transition-all duration-200 hover:shadow-lg"
                >
                  <h2 className="text-lg font-medium text-shadow-indigo-300 mb-2">{repo.name}</h2>
                  <p className="text-sm text-gray-800 mb-2">{repo.description || "No Description Available"}</p>
                  <span className="text-[12px] text-gray-800 p-1 rounded-2xl border border-blue-300">{repo.language || "Unknown"} </span>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default GitRepo;
