import express from "express";
import { getMessageForm, postMessage, getDeleteMessage, deleteMessage } from "../controllers/messageController.js"

const router = express.Router()


router.get("/message/create", getMessageForm);
router.post("/message/create", postMessage);
router.get("/message/:id", getDeleteMessage)
router.post("/message/:id", deleteMessage)

export { router as messageRouter }