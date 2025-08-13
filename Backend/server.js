import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import loginWithGithub from "./routes/github.route.js"

dotenv.config()
const app = express()

app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use("/api/github", loginWithGithub)

app.get("/", (req, res) => {
    res.send({message:"Testing api--Everything is working"})
})

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => {
    console.log("Server is running")
})

