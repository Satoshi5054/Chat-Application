import { Router } from "express"
import authRoutes from "./auth.routes.js"
import conversationRoutes from "./conversation.routes.js"
import messageRoutes from "./message.routes.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/conversations", conversationRoutes)
router.use("/messages",messageRoutes)

export default router