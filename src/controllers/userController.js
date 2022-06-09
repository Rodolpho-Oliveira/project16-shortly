import Joi from "joi"
import {v4 as uuidv4} from "uuid"
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
        res.status(500).send(e.detail)
    }
}

export async function loginUser(req,res){
    const userLogin = req.body
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    const validation = loginSchema.validate(userLogin)
    if(validation.error){
        return res.status(422).send(validation.error.details[0].message)
    }
    try{
        const db = await connectDB()
        const verification = await db.query('SELECT users.id, users.email, users.password FROM users WHERE users.email = $1 AND users.password = $2',[userLogin.email, userLogin.password])
        if(verification.rows.length){
            await db.query('INSERT INTO sessions (token, "userId") VALUES ($1,$2)',[uuidv4(), verification.rows[0].id])
            res.status(200).send(uuidv4())
        }
        else{
            res.sendStatus(401)
        }
    }catch(e){
        console.log(e)
        res.status(500).send(e.detail)
    }
}