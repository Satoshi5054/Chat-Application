import "dotenv/config"
import express from "express"
import http from "http"
import { Server } from "socket.io"

import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import cors from "cors"

import authRoutes from "./routes/auth.routes.js"
import { prisma } from "./lib/prisma.js"
import chatRoutes from "./routes/messages.routes.js"

const onlineUsers = new Map<string, string>()

const portNumber = Number(process.env.BACKEND_PORT) 
const frontendUrl = process.env.FRONTEND_URL

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: frontendUrl,
    credentials: true
}))

app.use("/auth", authRoutes)
app.use("/chat",chatRoutes)


const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin: frontendUrl,
        credentials: true
    }
})

//SOCKET AUTH MIDDLEWARE
io.use((socket: any, next)=>{
    try{
        const token = socket.handshake.auth?.token

        if(!token){
            return next(new Error("Unauthorized"))
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET! as string)

        socket.user = decoded
        next()
    }catch(err){
        next(new Error("Unauthorized"))
    }
})

// SOCKET CONNECTION
io.on("connection", (socket: any) => {
    const userId = socket.user.id
    console.log("UserConnected: ", userId)

    onlineUsers.set(userId,socket.id)

    // Join personal room (for direct emits)
    socket.join(userId)
    io.emit("user_online", userId)

    // Join a conversation room
    socket.on("join_conversation", (conversationId: string)=>{
        socket.join(conversationId)
        console.log(`User ${userId} joined ${conversationId}`)
    })
    
    socket.on("mark_read", async ({ conversationId, messageId }: {conversationId : string, messageId: string}) => {
        await prisma.conversationMember.update({
            where: {
            conversationId_userId: {
                conversationId,
                userId: socket.user.id
            }
            },
            data: {
            lastReadMessageId: messageId
            }
        })

        socket.to(conversationId).emit("messages_read", {
            userId: socket.user.id,
            messageId
        })
    })

    socket.on("typing", (conversationId: string)=>{
        socket.to(conversationId).emit("user_typing"), {
            userId
        }
    })


    socket.on("stop_typing", ( conversationId : string) => {
        socket.to(conversationId).emit("user_stop_typing", {
            userId
        })
    })

    // Leave conversation
    socket.on("leave_conversation", (conversationId: string) => {
        socket.leave(conversationId) 
    })

    socket.on("disconnect", () => {
        onlineUsers.delete(userId)
        console.log("User disconnected:", userId)
    })

})

// MAKE IO AVAILABLE IN CONTROLLERS
app.use((req: any, res, next) => {
  (req as any).io = io
  next()
})


//START SERVER
server.listen(portNumber,()=>{
    console.log(`Server running at port: ${portNumber}`)
})