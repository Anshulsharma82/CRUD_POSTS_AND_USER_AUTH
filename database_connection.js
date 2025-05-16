import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

async function dbConnect() {
    try {

        const dbUrl = process.env.DB_URL
        await mongoose.connect(dbUrl)
        console.log('database connected')
        return mongoose.connection
    } catch (error) {
        console.log("Error while connecting with DB:::", error)
    }
}

// dbConnect()

export default dbConnect