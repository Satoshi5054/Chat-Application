import type { Request, Response } from "express"
import { prisma } from "../lib/prisma.js"

export const getConversations = async (req: Request,res: Response) => {
  try {
    const conversations = await prisma.conversation.findMany({
        where: {
          members: {
            some: {
              userId: req.user.id
            }
          }
        },

        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },

        orderBy: {
          lastMessageAt: "desc"
        }
      })

    return res.json(conversations)

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: "Server Error"
    })
  }
}