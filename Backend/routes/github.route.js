import express from "express"
import { getRepo, getRepoContent, githubCallback, githubLogin } from "../controllers/github.controller.js"
const router = express.Router()

router.get("/login", githubLogin)
router.get("/callback", githubCallback)
router.get("/repo", getRepo)
router.get("/repo/getContent", getRepoContent)
export default router