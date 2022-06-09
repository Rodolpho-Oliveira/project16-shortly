import connectDB from "../app/db.js"

export async function authToken(req, res, next){
    const authorization = req.headers.authorization
    const token = authorization?.replace("Bearer", "").trim()

    try{
        const db = await connectDB()
        const auth = await db.query('SELECT token FROM sessions WHERE token=$1',[token])
        if(auth.rows.length === 0){
            return res.sendStatus(401)
        }
        const {rows} = await db.query(`SELECT * FROM users 
        JOIN sessions
        ON users.id = sessions."userId"
        WHERE users.id = sessions."userId"
        `)
        res.locals.user = rows[0]
    }catch(e){
        console.log(e)
        return res.status(500).send(e)
    }

    next()
}