import "dotenv/config"
import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"

// ================= REGISTER =================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, companyId } = req.body

    if (!name || !email || !password || !companyId || !role) {
      return res.status(400).json({ message: "Missing fields" })
    }

    // check if user exists in same company
    const existingUser = await prisma.user.findUnique({
      where: {
        email_companyId: {
          email,
          companyId
        }
      }
    })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists in this company" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        companyId,
        role
      }
    })

    res.status(201).json({
      message: "User created successfully",
      userId: user.id
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// ================= LOGIN =================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, companyId } = req.body

    if (!email || !password || !companyId) {
      return res.status(400).json({ message: "Missing credentials" })
    }

    const user = await prisma.user.findUnique({
      where: {
        email_companyId: {
          email,
          companyId
        }
      }
    })

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    //NEVER take role from client
    const token = jwt.sign(
      {
        userId: user.id,
        companyId: user.companyId,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ message: "Logged in" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// ================= ME =================
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

// ================= LOGOUT =================
export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token")
  res.json({ message: "Logged out" })
}