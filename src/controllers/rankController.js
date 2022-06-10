import connectDB from "../app/db.js"

export async function showRank(req,res){
    try{
        const db = await connectDB()
        const {rows} = await db.query(`SELECT urls."userId", users.name, COUNT(urls.url) as "linksCount", SUM(urls."visitCount") as "visitCount" 
        FROM urls 
        JOIN users
        ON users.id = urls."userId"
        GROUP BY urls."userId", users.name
        ORDER BY "visitCount" DESC
        LIMIT 10`)
        res.status(200).send(rows)
    }catch(e){
        res.status(500).send(e)
    }
}