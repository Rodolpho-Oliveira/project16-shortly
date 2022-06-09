import { Router } from "express"
import { getUrl, shortenUrl } from "../controllers/urlController.js"
import { authToken } from "../middlewares/authMiddleware.js"

const urlRouter = Router()

urlRouter.post("/urls/shorten", authToken,shortenUrl)
urlRouter.get("/urls/:id", getUrl)

export default urlRouter