import axios from "axios";

const tokenStore = {};

export const githubLogin = (req, res) => {
  const loginUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
  res.json({ url: loginUrl });
};

// github callBack url
export const githubCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );
    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return res.status(400).json({ Message: "Token not received" });
    }
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });
    const userName = userRes.data.login;
    tokenStore[userName] = accessToken;
    if (userName) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/?success=true&user=${userName}`
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: error });
  }
};

export const getRepo = async (req, res) => {
  const  userName  = req.query.user;
  try {
    const token = tokenStore[userName];
    if (!token) {
      return res.status(400).json({ error: "Token not found" });
    }
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `token ${token}` },
    });
    return res.json({allRepo: response.data})
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getRepoContent = async(req, res) => {
  const {userName, selectedRepo, path= ""} = req.query
  try{
    const url = `https://api.github.com/repos/${userName}/${selectedRepo}/contents/${path}`
    const apiResponse = await axios.get(url)
    if(apiResponse){
      return res.status(200).json({success:true, content: apiResponse.data})
    }
  }catch(error){
    console.log(error)
    return res.status(500).json({success: false, error:error})
  }
}

