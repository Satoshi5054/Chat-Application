import "dotenv/config"
import http from "http"

import app from "./app.js"
import { initSocket } from "./sockets/index.js"

const portNumber = Number(process.env.BACKEND_PORT)!

const server = http.createServer(app)

initSocket(server)

server.listen(portNumber, () => {
  console.log(`Server running at port ${portNumber}`)
})