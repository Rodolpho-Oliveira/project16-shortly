import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "../routes/userRouter.js"
import urlRouter from "../routes/urlRouter.js"
import rankRouter from "../routes/rankRouter.js"
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use(userRouter)
app.use(urlRouter)
app.use(rankRouter)

app.listen(process.env.PORT)