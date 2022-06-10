import Joi from "joi"
import {v4 as uuidv4} from "uuid"
import bcrypt from "bcrypt"
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
    const encryptedPassword = bcrypt.hashSync(userInfo.password,10)
    try{
        
        const db = await connectDB()
        await db.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3)',[userInfo.name,userInfo.email,encryptedPassword])
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
        const verification = await db.query('SELECT users.id, users.email, users.password FROM users WHERE users.email = $1',[userLogin.email])
        if(verification.rows.length && bcrypt.compareSync(userLogin.password, verification.rows[0].password)){
            await db.query('DELETE FROM sessions WHERE "userId"=$1',[verification.rows[0].id])
            await db.query('INSERT INTO sessions (token, "userId") VALUES ($1,$2)',["Bearer " + uuidv4(), verification.rows[0].id])
            res.status(200).send(uuidv4())
        }
        else{
            res.sendStatus(401)
        }
    }catch(e){
        res.status(500).send(e.detail)
    }
}

export async function getUser(req, res){
    const {id} = req.params
    try{
        const db = await connectDB()
        const user = await db.query('SELECT * FROM users WHERE id=$1',[id])
        if(!user.rows.length){
            return res.sendStatus(404)
        }
        const {rows} = await db.query(`SELECT urls.id, urls."shortUrl", urls.url, urls."visitCount" FROM urls 
        JOIN users
        ON urls."userId" = users.id
        WHERE urls."userId" = $1`,[id])
        let url = []
        let visitCounts = 0
        rows.forEach((data) => {
            visitCounts += data.visitCount
            url.push(data)
        })
        const urls = {
            id: user.rows[0].id,
            name: user.rows[0].name,
            visitCount: visitCounts,
            shortenendUrls: url
        }
        res.status(200).send(urls)
    }catch(e){
        console.log(e)
        return res.status(500).send(e)
    }
}