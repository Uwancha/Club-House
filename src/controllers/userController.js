import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

// User model
import { UserModel } from "../models/usermodel.js";

// passport configuration
import passport from "passport";

const getSignupForm = async (req, res) => {
    console.log("request hit")

    res.render("sign_up_form", {
        title: "Sign Up"
    } )
}

const hashPassword = async (req, res, next) => {
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    req.body.hashedPassword = hashedPassword;
    next()
} 

const signUpUser = [
    body('name', "Name is required")
        .escape()
        .isLength({min: 3, max: 20})
        .withMessage("Name must be between 3 and 20 characters"),
    
    body('email', 'Email is required')
        .escape()
        .isEmail()
        .withMessage("Please enter valid email address"),
    
    body('password', 'Password is required')
        .escape()
        .isLength({min: 8, max: 16})
        .withMessage('Password must be between 8 and 16 characters'),

    body('passwordConfirmation', 'password does not match')
        .custom((value, {req}) => value === req.body.password ),

    hashPassword,

    async (req, res) => {
        const errors = validationResult(req);

        // Check if user already exists
        const userExists = await UserModel.findOne({name: req.body.name}).exec();
        
        if (userExists) {
            res.render('sign_up_form', {
                title: "Sign Up",
                error: "User already exists",
            });

            return;
        } 
            // Check for errors
        if (!errors.isEmpty()) {
            res.render('sign_up_form', {
                title: "Sign Up",
                errors: errors.array()
            });

            return;
        }

        // No errors save the user
        const user = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: req.body.hashedPassword,
            admin: false,
            member: false,
        } )

        const newUser = await user.save()

        res.send(newUser)
    }
];

const getLoginForm = async (req, res,) => {
    res.render("login_form", {
        title: "Login"
    })
};

const handleLoggingIn = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        // Handle databse error
        if (err) {
            return next(err)
        }

        if (!user) {
            // Authentication failed, render login with respecting error
            return res.render("login_form", {
                title: "Login",
                errors: info ? info.message: "Authentication failed"
            })
        }

        // Authentication succesfull, login user
        req.logIn(user, (loginErr) => {
            // Handle logging in error
            if (loginErr) {
                return next(loginErr)
            }

            // Login successfull, redirect to homepage
            res.redirect("/")
        })

    })(req, res, next)
}

export { getSignupForm, signUpUser, getLoginForm, handleLoggingIn}