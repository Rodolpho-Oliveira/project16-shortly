import { Router } from "express"
import { getUser, loginUser, registerUser } from "../controllers/userController.js"
import { authToken } from "../middlewares/authMiddleware.js"

const userRouter = Router()

userRouter.post("/signup", registerUser)
userRouter.post("/signin", loginUser)
userRouter.get("/users/:id", authToken, getUser)

export default userRouter