import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt"


// User model
import { UserModel } from "./models/usermodel.js";


passport.use(
    new LocalStrategy({usernameField: "email", passwordField: "password"}, async (email, password, done) => {

        try {
            const user = await UserModel.findOne({email: email}).exec()

            if (!user) {
                return done('null', false, {message: "Incorrect email"} )
            }

            const match = await bcrypt.compare(password, user.password)

            if (!match) {
                return done(null, false, {message: "Incorrect password"} )
            }

            return done(null, user)

            
        } catch (err) {
            return done(err)
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    UserModel.findById(id)
        .then(user => {
            done(null, user)
        })
        .catch(err => {
            done(err)
        })
})

export { passport };