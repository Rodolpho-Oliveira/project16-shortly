import { Router } from "express"
import { getRedirectUrl, getUrl, removeUrl, shortenUrl } from "../controllers/urlController.js"
import { authToken } from "../middlewares/authMiddleware.js"

const urlRouter = Router()

urlRouter.post("/urls/shorten", authToken,shortenUrl)
urlRouter.get("/urls/:id", getUrl)
urlRouter.get("/urls/open/:shortUrl", getRedirectUrl)
urlRouter.delete("/urls/:id", authToken, removeUrl)

export default urlRouter