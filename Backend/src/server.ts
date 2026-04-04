import "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"

const app = express()
const portNumber = Number(process.env.BACKEND_PORT) 
const frontendUrl = process.env.FRONTEND_URL

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: frontendUrl,
    credentials: true
}))

app.use("/auth", authRoutes)

app.listen(portNumber,()=>{
    console.log(`Server running at port: ${portNumber}`)
})