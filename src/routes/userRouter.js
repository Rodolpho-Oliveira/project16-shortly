import { Router } from "express"
import { registerUser } from "../controllers/userController.js"

const userRouter = Router()

userRouter.post("/signup", registerUser)

export default userRouter