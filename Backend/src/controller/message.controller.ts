import type { Request, Response } from "express"
import { prisma } from "../lib/prisma.js"
import { getIO } from "../sockets/index.js"

export const sendMessage = async (req: Request,res: Response) => {
  try {
    const { conversationId, content } = req.body

    if (typeof conversationId !== "string" || !content) {
      return res.status(400).json({
        message: "Conversation ID and content are required"
      })
    }

    const messageConversationId = conversationId

    const message = await prisma.message.create({
      data: {
        content,
        conversationId: messageConversationId,
        senderId: req.user.id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    const io = getIO()
    io.to(messageConversationId).emit("new-message", message)

    await prisma.conversation.update({
      where: {
        id: messageConversationId
      },
      data: {
        lastMessage: content,
        lastMessageAt: new Date()
      }
    })

    return res.status(201).json(message)

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: "Server Error"
    })
  }
}

export const getMessages = async (req: Request,res: Response) => {
  try {
    const { conversationId } = req.params

    if (typeof conversationId !== "string") {
      return res.status(400).json({
        message: "Conversation ID is required"
      })
    }

    

    const messages = await prisma.message.findMany({
      where: {
        conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    return res.json(messages)

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: "Server Error"
    })
  }
}