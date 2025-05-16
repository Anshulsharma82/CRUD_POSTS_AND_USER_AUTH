import express from "express"
const app = express()
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
dotenv.config()

import dbConnect from "./database_connection.js"
import userRouter from "./Routes/userRoute.js"
import profileRouter from './Routes/profileRoute.js'
import routeNotFound from "./middleware/notFound.js"

const PORT = process.env.PORT;

app.use(cookieParser())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/',userRouter)
app.use('/profile', profileRouter )
app.use(routeNotFound)

app.listen( PORT, async () => {
    console.log('server is running on', PORT )
    await dbConnect()
}) 