import type { Server } from "socket.io"

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string
        companyId: string
        role: string
      }
      io: Server
    }
  }
}

export {}