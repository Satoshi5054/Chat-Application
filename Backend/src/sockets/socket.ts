import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"

const onlineUsers = new Map<string, string>()

export const initSocket = (io: Server) => {

  //Socket Auth Middleware
  io.use((socket: any, next) => {
    try {
      const token = socket.handshake.auth?.token

      if (!token) return next(new Error("Unauthorized"))

      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      socket.user = decoded

      next()
    } catch {
      next(new Error("Unauthorized"))
    }
  })

  // Connection
  io.on("connection", (socket: any) => {
    const userId = socket.user.id
    console.log("UserConnected:", userId)

    onlineUsers.set(userId, socket.id)

    socket.join(userId)
    io.emit("user_online", userId)

    // Join conversation
    socket.on("join_conversation", (conversationId: string) => {
      socket.join(conversationId)
    })

    // Mark read
    socket.on("mark_read", async ({ conversationId, messageId }: {conversationId: string, messageId: string}) => {
      await prisma.conversationMember.update({
        where: {
          conversationId_userId: {
            conversationId,
            userId
          }
        },
        data: {
          lastReadMessageId: messageId
        }
      })

      socket.to(conversationId).emit("messages_read", {
        userId,
        messageId
      })
    })

    // Typing
    socket.on("typing", (conversationId: string) => {
      socket.to(conversationId).emit("user_typing", { userId })
    })

    socket.on("stop_typing", (conversationId: string) => {
      socket.to(conversationId).emit("user_stop_typing", { userId })
    })

    // Leave
    socket.on("leave_conversation", (conversationId: string) => {
      socket.leave(conversationId)
    })

    // Disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(userId)
      console.log("User disconnected:", userId)
    })
  })
}