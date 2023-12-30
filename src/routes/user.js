import express from "express";

import { 
    getSignupForm, 
    signUpUser, 
    getLoginForm,
    handleLoggingIn,
    getJoinForm,
    joinUser
 } from "../controllers/userController.js";

const router = express.Router();

// Login routes
router.get("/signup", getSignupForm);
router.post("/signup", signUpUser);

// Login routes
router.get("/login", getLoginForm);
router.post("/login", handleLoggingIn)

// Logout user
router.get("/logout", (req, res, next) => {
    req.logOut(err => {
        if (err) {
            return next(err)
        }

        res.redirect('/')
    })
})

// Let user join club
router.get("/join", getJoinForm)
router.post("/join", joinUser)

export { router as userRouter };