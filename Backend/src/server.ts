import "dotenv/config"
import http from "http"
import { Server } from "socket.io"

import app from "./app.js"
import { initSocket } from "./sockets/socket.js"

const portNumber = Number(process.env.BACKEND_PORT)!
const frontendUrl = process.env.FRONTEND_URL!

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    credentials: true
  }
})

// Initialize socket logic
initSocket(io)

// Make io available in controllers
app.use((req: any, res, next) => {
  req.io = io
  next()
})

server.listen(portNumber, () => {
  console.log(`Server running at port: ${portNumber}`)
})