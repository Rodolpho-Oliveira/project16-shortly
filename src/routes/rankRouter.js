import { Router } from "express"
import { showRank } from "../controllers/rankController.js"

const rankRouter = Router()

rankRouter.get("/ranking", showRank)

export default rankRouter