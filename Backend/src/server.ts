import "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"

const app = express()
const portNumber = process.env.BACKEND_PORT!

app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRoutes)

app.listen(portNumber,()=>{
    console.log(`Server running at port: ${portNumber}`)
})