import { Router } from "express"
import authRoutes from "./auth.routes.js"
import chatRoutes from "./messages.routes.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/chat", chatRoutes)

export default router