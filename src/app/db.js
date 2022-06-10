import pg from "pg"
import dotenv from "dotenv"
dotenv.config()

let chachedDB = null
let connectionParams = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
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