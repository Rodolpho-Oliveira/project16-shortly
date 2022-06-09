import { Router } from "express"
import { loginUser, registerUser } from "../controllers/userController.js"

const userRouter = Router()

userRouter.post("/signup", registerUser)
userRouter.post("/signin", loginUser)

export default userRouter