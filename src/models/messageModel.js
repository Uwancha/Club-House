import mongoose, { SchemaTypes } from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        title: {type: String, required: true, minLength: 5, maxLength: 30},
        text: {type: String, required: true, minLength: 5, maxLength: 30},
        user: {type: Schema.Types.ObjectId, ref: "User"}
    }, 

    {
        timestamps: true
    }
);

const MessageModel = mongoose.model('Message', MessageSchema);

expo

