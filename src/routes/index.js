import express from "express";
import { listAnonymousMessages } from "../controllers/messageController.js"


const router = express.Router();

// Get anonymous messages for non members
router.get('/', listAnonymousMessages)

export { router as indexRouter }