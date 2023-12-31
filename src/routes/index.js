import express from "express";
import { messages } from "../controllers/messageController.js"


const router = express.Router();

// Display all messages
router.get('/', messages);

export { router as indexRouter }