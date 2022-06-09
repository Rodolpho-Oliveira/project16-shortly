import connectDB from "../app/db.js"
import { nanoid } from "nanoid"
import Joi from "joi"

export async function shortenUrl(req, res){
    const {url} = req.body
    const user = res.locals.user.id
    const shortUrl = nanoid()
    const urlSchema = Joi.object({
        url: Joi.string().uri().required()
    })
    const validation = urlSchema.validate(req.body)
    if(validation.error){
        return res.status(422).send(validation.error.details[0].message)
    }
    try{
        const db = await connectDB()
        await db.query('INSERT INTO urls (url,"shortUrl","visitCount","userId") VALUES ($1,$2,$3,$4)',[url,shortUrl,null,user])
        res.status(201).send({shortUrl: shortUrl})
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}