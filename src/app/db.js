import pg from "pg"
import dotenv from "dotenv"
dotenv.config()

let chachedDB = null
let connectionParams = {
    host: process.env.DATABASE_HOST,
    port: process.env.PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
}

export default async function connectDB(){
    if(chachedDB){
        return chachedDB
    }

    if (process.env.DATABASE_URL) {
        connectionParams = {
          connectionString: process.env.DATABASE_URL,
        }
      }

    if (process.env.MODE === "PROD") {
        connectionParams.ssl = {
        rejectUnauthorized: false,
        }
    }

    const { Pool } = pg

    const db = new Pool(connectionParams)

    await db.connect()

    chachedDB = db

    return db
}