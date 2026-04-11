import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import routes from "./routes/index.route.js"

const frontendUrl = process.env.FRONTEND_URL

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: frontendUrl,
  credentials: true
}))

app.use("/api", routes)

export default app