import "dotenv/config"
import { Server } from "socket.io"

let io: Server

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  })

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("join-conversation", (conversationId: string) => {
      socket.join(conversationId)
    })

    socket.on("disconnect", () => {
      console.log("User disconnected")
    })
  })

  return io
}

export const getIO = () => io