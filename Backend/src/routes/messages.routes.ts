import { Router } from "express"
import { sendMessage, getMessages } from "../controller/message.controller.js"

const router = Router()

router.post("/messages",sendMessage)
router.get("/messages",getMessages)

export default router