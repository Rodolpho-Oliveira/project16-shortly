import { Router } from "express"
import { shortenUrl } from "../controllers/urlController.js"
import { authToken } from "../middlewares/authMiddleware.js"

const urlRouter = Router()

urlRouter.post("/urls/shorten", authToken,shortenUrl)

export default urlRouter