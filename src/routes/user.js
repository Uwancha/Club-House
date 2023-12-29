import express from "express";

import { getSignupForm, signUpUser, getLoginForm, handleLoggingIn } from "../controllers/userController.js"

const router = express.Router();

// Login routes
router.get("/signup", getSignupForm);
router.post("/signup", signUpUser);


// Login routes
router.get("/login", getLoginForm);
router.post("/login", handleLoggingIn)

export { router as userRouter };