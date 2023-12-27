import { config as configDotenv } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import  path from "path";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
//import pug from "pug"

configDotenv();

const mongoDB = process.env.MONGODB_URI;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(mongoDB, options);

const db = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))

db.once("open", () => {
    console.log("Database connected successfully")
})



const app = express()

const currentModuleDir = path.dirname(new URL(import.meta.url).pathname);


// Set view engine

app.set("views", path.join(currentModuleDir, "views"));
app.set("view engine", 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(currentModuleDir, 'public')));

app.use(helmet());

// Compress all routes 
app.use(compression());



const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20
})


app.use(limiter)

app.get('/', (req, res) => res.render("index"))


const port = process.env.PORT || 3000

app.listen(port, () => console.log('Server running on port', port))

