import { Router } from "express"
import requireAuth from "../middleware/requireAuth.js"
import { sendMessage, getMessages } from "../controller/message.controller.js"

const router = Router()

router.get("/:conversationId",requireAuth,getMessages)
router.post("/",requireAuth,sendMessage)

export default router