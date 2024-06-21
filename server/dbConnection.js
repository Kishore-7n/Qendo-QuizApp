import pg from "pg"
import dotenv from "dotenv"

dotenv.config();

const db = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

const connectDB = async () => {
    try {
        await db.connect();
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Error in Connecting DB: ", error);
    }
}

export { db, connectDB }