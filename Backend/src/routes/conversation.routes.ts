import { Router } from "express"
import requireAuth from "../middleware/requireAuth.js"
import { getConversations } from "../controller/conversation.controller.js"

const router = Router()

router.get("/", requireAuth, getConversations)

export default router