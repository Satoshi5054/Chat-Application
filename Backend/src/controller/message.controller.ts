import type { RequestHandler } from "express"
import { prisma } from "../lib/prisma.js"

//////////////////////////////////////////////////////
// SEND MESSAGE
//////////////////////////////////////////////////////

export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const {conversationId, content, type="TEXT"} = req.body
    const user = req.user

    if(!conversationId || !content){
      return res.status(400).json({ message : "Missing fields" })
    }

    // Ensure user is part of conversation 
    const membership = await prisma.conversationMember.findFirst({
      where: {
        conversationId,
        userId : user.id
      }
    })

    if (!membership) {
      return res.status(403).json({ message: "Not part of this conversation" })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        type,
        conversationId,
        senderId : user.id
      }
    })

    // Update conversation 
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: content,
        lastMessageAt: new Date()
      }
    })

    req.io.to(conversationId).emit("receive_message", message)

    return res.status(201).json(message)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}

//////////////////////////////////////////////////////
// GET MESSAGES (CURSOR PAGINATION)
//////////////////////////////////////////////////////

export const getMessages: RequestHandler = async (req, res) => {
  try {
    const { conversationId, cursor } = req.query as {
      conversationId: string
      cursor?: string
    }

    const user = req.user

    if (!conversationId) {
      return res.status(400).json({ message: "Missing conversationId" })
    }

    // Security check
    const membership = await prisma.conversationMember.findFirst({
      where: {
        conversationId,
        userId: user.id
      }
    })

    if (!membership) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const query: any = {
      where: { conversationId },
      take: 20,
      orderBy: { createdAt: "desc"},
      include: {
        sender: {
          select: {id: true, name: true}
        }
      }
    }

    if(cursor){
      query.cursor = { id: cursor},
      query.skip = 1
    }

    const messages = await prisma.message.findMany(query)

    return res.json(messages)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}

//////////////////////////////////////////////////////
// MARK AS READ 
//////////////////////////////////////////////////////

export const markAsRead: RequestHandler = async (req, res) => {
  try {
    const { conversationId, messageId } = req.body
    const user = req.user

    if (!conversationId || !messageId) {
      return res.status(400).json({ message: "Missing fields" })
    }

    // Ensure user is part of conversation
    const membership = await prisma.conversationMember.findFirst({
      where: {
        conversationId,
        userId: user.id
      }
    })

    if (!membership) {
      return res.status(403).json({ message: "Not authorized" })
    }

    //  Update last read pointer
    await prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: user.id
        }
      },

      data: {
        lastReadMessageId: messageId
      }
    })
    
    req.io.to(conversationId).emit("message_read"),{
      userId: user.id,
      messageId
    }

    res.json({ success: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}