import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, required: true, minLength:3, maxLength: 20},
    email: {type: String, required: true, minLength:5, maxLength: 20},
    password: {type: String, required: true, minLength: 8},
    admin: Boolean,
    member: Boolean
})

const UserModel = mongoose.model("user", UserSchema);

export { UserModel };