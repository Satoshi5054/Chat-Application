import "dotenv/config"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"
import type { Payload } from "../middleware/requireAuth.js"

let io: Server
const onlineUsers = new Map<string, string>()

const emitOnlineUsers = () => {
  io.emit("online-users", [...onlineUsers.keys()])
}

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  })

  io.use((socket, next) => {
    try {
      const token = socket.handshake.headers.cookie
        ?.split("; ")
        .find((cookie) => cookie.startsWith("token="))
        ?.split("=")[1]

      if (!token) {
        return next(new Error("Unauthorized"))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Payload

      socket.data.userId = decoded.userId

      next()
    } catch {
      next(new Error("Unauthorized"))
    }
  })

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string

    onlineUsers.set(userId, socket.id)
    emitOnlineUsers()

    console.log(`User connected: ${userId} (${socket.id})`)

    socket.on("join-conversation", (conversationId: string) => {
      socket.join(conversationId)
    })

    socket.on("leave-conversation", (conversationId: string) => {
      socket.leave(conversationId)
    })

    socket.on("typing", (conversationId: string) => {
      socket.to(conversationId).emit("user-typing", userId)
    })

    socket.on("stop-typing", (conversationId: string) => {
      socket.to(conversationId).emit("user-stop-typing", userId)
    })

    socket.on("mark-read", async (conversationId: string) => {
      try {
        const latestMessage = await prisma.message.findFirst({
          where: {
            conversationId
          },
          orderBy: {
            createdAt: "desc"
          },
          select: {
            id: true
          }
        })

        if (!latestMessage) {
          return
        }

        const updateResult = await prisma.conversationMember.updateMany({
          where: {
            conversationId,
            userId
          },
          data: {
            lastReadMessageId: latestMessage.id
          }
        })

        if (updateResult.count === 0) {
          return
        }

        io.to(conversationId).emit("messages-read", {
          userId,
          messageId: latestMessage.id
        })
      } catch (error) {
        console.error("mark-read error", error)
      }
    })

    socket.on("disconnect", () => {
      const currentSocketId = onlineUsers.get(userId)

      if (currentSocketId === socket.id) {
        onlineUsers.delete(userId)
        emitOnlineUsers()
      }

      console.log(`User disconnected: ${userId} (${socket.id})`)
    })
  })

  return io
}

export const getIO = () => io