import connectDB from "../app/db.js"

export async function showRank(req,res){
    try{
        const db = await connectDB()
        const {rows} = await db.query(`SELECT users.id, users.email, COUNT(urls.url) as "linksCount", COALESCE(SUM(urls."visitCount"),0) as "visitCount" 
        FROM urls 
        RIGHT JOIN users
        ON users.id = urls."userId"
        GROUP BY users.id
        ORDER BY "visitCount" DESC
        LIMIT 10`)
        res.status(200).send(rows)
    }catch(e){
        res.status(500).send(e)
    }
}