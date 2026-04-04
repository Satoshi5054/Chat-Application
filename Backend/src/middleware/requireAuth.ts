import "dotenv/config"
import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction} from "express"
import { prisma } from "../lib/prisma.js"

type paylaod = {
    userId:  string
    companyId: string
    role: string

}

interface UserRequest extends Request{
    user : {
        id: string
        companyId: string
        role: string
    }
}

export const requireAuth = async (req :  UserRequest, res: Response, next: NextFunction)=>{
    try{
        const token = req.cookies.token

        if(!token){
            return res.status(401).json({message : "Unauthorized"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as paylaod

        const user = await prisma.user.findUnique({
            where:{
                id : decoded.userId
            }
        })

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        req.user = {
            id: user.id,
            companyId: user.companyId,
            role: user.role
        }

        next()
        
    }catch(err){
        return res.status(401).json({message : "Invalid Token"})
    }
}