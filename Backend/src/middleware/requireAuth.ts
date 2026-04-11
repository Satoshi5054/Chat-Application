import "dotenv/config"
import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction} from "express"

type Payload = {
    userId:  string
    companyId: string
    role: string

}

const requireAuth = async (req : Request, res: Response, next: NextFunction)=>{
    try{
        const token = req.cookies.token

        if(!token){
            return res.status(401).json({message : "Unauthorized"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Payload

        req.user = {
            id: decoded.userId,
            companyId: decoded.companyId,
            role: decoded.role
        }

        next()

    }catch(err){
        return res.status(401).json({message : "Invalid Token"})
    }
}

export default requireAuth