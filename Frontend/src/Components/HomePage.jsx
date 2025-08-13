import {
  AudioLines,
  ChartScatter,
  Unplug
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import toast from "react-hot-toast"
import { UserContext } from "../Store/UserContext";

const featureData = [
  {
    icon: <AudioLines className="h-9 w-9 text-zinc-900" />,
    heading: "AI-Powered Test Case Generation",
    desc: "Prevent from manual test case generation, generate the test cases by using AI",
  },
  {
    icon: <ChartScatter className="h-9 w-9 text-zinc-900" />,
    heading: "Automatic Code Analysis",
    desc: "Analyse the code by AI and generate efficient test cases within a short span of time",
  },
  {
    icon: <Unplug className="h-9 w-9 text-zinc-900" />,
    heading: "Integration with GitHub",
    desc: "Integrate with AI and simulate the workflow of interacting with the repo of user",
  },
];



const HomePage = () => {
  const {userName} = useContext(UserContext)
  // const {setUserName} = useContext(UserContext)
  // const [searchParams] = useSearchParams();
  // const user = searchParams.get("user");
  // if(user){
  //   setUserName(user)
  // }
  const navigate = useNavigate()
  const HandleImporting = () =>{
    if (userName){
      navigate("/gitRepo")
    }else{
      toast.error("Please Login First")
    }
  }
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8"> 
      
      {/* Hero Section */}
      <div className="flex flex-col items-center py-12">
        <h1 className="font-bold md:text-6xl text-2xl text-gray-900">
          AI Test Case Generator
        </h1>
        <p className="max-w-3xl font-medium my-6 sm:text-lg text-sm text-gray-700 text-center">
          Generate test cases effortlessly with AI.Integrate with GitHub to
          generate suggested test case summaries and code using AI.
        </p>
        <button 
        onClick={HandleImporting}
        className="px-4 py-2 font-medium rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-zinc-200 hover:from-purple-500 hover:to-blue-500  transition-all duration-200 cursor-pointer">
          Import from Github
        </button>
      </div>
      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-12 border-gray-400">
        {featureData.map((item, idx) => (
          <div 
          key={idx}
          className="flex flex-col items-center p-4 gap-4 border border-gray-600 rounded-sm shadow-md">
            <p className="">{item.icon}</p>
            <p className="text-lg font-semibold text-gray-700">
              {item.heading}
            </p>
            <p className="text-sm font-semibold text-gray-700 text-center">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="py-12">Made with Love❤️ in India</p>
        <p className="text-sm pb-2">Copyright&#169; 2025</p>
      </div>
    </div>
  );
};

export default HomePage;
