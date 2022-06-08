import Joi from "joi"
import connectDB from "../app/db.js"

export async function registerUser(req,res){
    const userInfo = req.body
    const registerSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.ref("password")
    })
    const validation = registerSchema.validate(userInfo)
    if(validation.error){
        return res.status(422).send(validation.error.details[0].message)
    }

    try{
        const db = await connectDB()
        await db.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3)',[userInfo.name,userInfo.email,userInfo.password])
        res.sendStatus(201)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}