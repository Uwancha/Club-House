import { MessageModel } from "../models/messageModel.js";
import { body, validationResult } from "express-validator";
import moment from "moment";

// List all messages
const messages = async (req, res) => {
    const messages = await MessageModel.find().populate('user').sort({createdAt: -1});

    messages.forEach(message => {
        message.createdAt = new Date(message.createdAt)
        message.updatedAt = new Date(message.updatedAt);

        console.log(new Date(Date.parse(message.createdAt)))

        message.createdAt = moment(message.createdAt).fromNow();

    });

    console.log(messages);

    res.render("index", {
        title: "Messages",
        messages
    })
}

const getMessageForm = async (req, res) => {
    res.render("message_form", {
        title: "Send Message",
    })
}

const postMessage = [
    body("title", "title is required")
        .trim()
        .escape(),

    body("message", "message is required")
        .trim()
        .escape()
        .isLength({max: 100})
        .withMessage("Maximum length is 100 letters"),

    async (req, res, next) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.render("message_form", {
                    title: "Send Message",
                    errors: errors.array()
                })
            }

            const message = new MessageModel({
                title: req.body.title,
                text: req.body.message,
                user: req.user._id
            })

            const newMessage =  await message.save();

            res.redirect("/")

        } catch (error) {
            return next(error)
        }
    }

]

const getDeleteMessage = async (req, res) => {
    const message = await MessageModel.findById(req.params.id).exec()

    if (!message) {
        res.render("message_delete",{
            nomessage: "No message to delete"
        })
    }

    res.render("message_delete",{
        message
    })

}

const deleteMessage = async (req, res, next) => {
    try {
        await MessageModel.findByIdAndDelete(req.params.id).exec();

        res.redirect("/")
    } catch (error) {
        next(error)
    }
}

export { messages, getMessageForm, postMessage, getDeleteMessage, deleteMessage }