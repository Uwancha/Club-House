import express from "express";
import { getMessageForm, postMessage, getDeleteMessage, deleteMessage } from "../controllers/messageController.js"

const router = express.Router()


router.get("/create", getMessageForm);
router.post("/create", postMessage);
router.get("/:id", getDeleteMessage)
router.post("/:id", deleteMessage)

export { router as messageRouter }