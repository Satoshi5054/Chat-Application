//JWT_SECRET should be present in the .env

import "dotenv/config"
import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"

//Register new user of the application
export const register = async (req: Request, res: Response) =>{
    try{
        const { name, email, password, companyId, role } = req.body

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if(existingUser){
            return res.status(400).json({ message : "User Already Exists"})
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name, email, password: hashPassword, companyId, role
            }
        })

        res.status(201).json({
            message: "User created succesfully",
            userId: user.id
        })

    }catch(error){
        res.status(500).json({ message: "Server error" })
    }
}

//Login user based on cookies
export const me = (req: Request, res: Response) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ loggedIn: false })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    res.json({ loggedIn: true, user: decoded })
  } catch {
    res.status(401).json({ loggedIn: false })
  }
}

//Login User to application based on password
export const login = async (req: Request, res: Response)=>{
    const { email, password, companyId, role } = req.body

    const user = await prisma.user.findUnique({
        where:{ email, companyId }
    })

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({
        userId: user.id,
        companyId: user.companyId,
        role
    }, 
        process.env.JWT_SECRET!,
        {expiresIn: "7d"}
    )

    res.cookie("token", token,{
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ message: "Logged in" })
}


//When user logs out
export const logout = (res: Response) =>{
    res.clearCookie("token")
    res.json({ message: "Logged out" })
}