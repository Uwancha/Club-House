import { config as configDotenv } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import createError from "http-errors";
import { passport } from "./passport.js";
import session  from "express-session";

// Routes
import { userRouter as userRoute } from "./routes/user.js";

// Dotenv 
configDotenv();


// connect to database
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


// Intialize the app
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

// Set limit to 
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20
})

app.use(limiter)

// Set session middleware
app.use(session({
  secret: process.env.SECRET, 
  resave:false, 
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 24
  }
}))

// Intialize passport
app.use(passport.initialize());
app.use(passport.session());

// Set local variable
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

// Handle routes
app.get('/', (req, res) => res.render("index"));
app.use("/", userRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



const port = process.env.PORT || 3000

app.listen(port, () => console.log('Server running on port', port))

