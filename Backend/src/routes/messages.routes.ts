import { Router } from "express"
import { getMessages, getConversations } from "../controller/message.controller.js"
import requireAuth from "../middleware/requireAuth.js"

const router = Router()

router.get("/conversatons",requireAuth,getConversations)
router.get("/messages",requireAuth,getMessages)
export default router