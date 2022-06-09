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
        await db.query('INSERT INTO urls (url,"shortUrl","visitCount","userId") VALUES ($1,$2,$3,$4)',[url,shortUrl,0,user])
        res.status(201).send({shortUrl: shortUrl})
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

export async function getUrl(req, res){
    const {id} = req.params
    try{
        const db = await connectDB()
        const {rows} = await db.query('SELECT id, "shortUrl", url FROM urls WHERE id=$1',[parseInt(id)])
        console.log(rows)
        if(!rows.length){
            return res.sendStatus(404)
        }
            res.status(200).send(rows[0])
    }catch(e){
        res.status(500).send(e)
    }
}

export async function getRedirectUrl(req,res){
    const {shortUrl} = req.params
    try{
        const db = await connectDB()
        const {rows} = await db.query('SELECT url FROM urls WHERE "shortUrl"=$1',[shortUrl])
        if(!rows.length){
            return res.sendStatus(404)
        }
        await db.query('UPDATE urls SET "visitCount"= "visitCount" + 1 WHERE "shortUrl"=$1',[shortUrl])
        res.redirect(rows[0].url)
    }catch(e){
        res.status(500).send(e)
    }
}

export async function removeUrl(req, res){
    const {id} = req.params
    try{
        const db = await connectDB()
        const {rows} = await db.query('SELECT * FROM urls WHERE id=$1',[id])
        if(!rows.length){
            return res.sendStatus(404)
        }
        if(res.locals.user.id === rows[0].userId){
            await db.query('DELETE FROM urls WHERE "userId"=$1 AND id=$2',[res.locals.user.id, id])
            return res.sendStatus(204)
        }
        res.sendStatus(401)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}