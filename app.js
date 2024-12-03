import dotenv from "dotenv";
import express from "express";
import createHttpError from "http-errors";
// import mongoose from "mongoose";
import morgan from "morgan";
import connectDB from "./config/db.config.js";
import index from "./routes/index.route.js";
import user from "./routes/user.route.js";
import auth from "./routes/auth.route.js";
// import { User } from "./models/User.model.js";
import bcrypt from "bcrypt";
import session from "express-session";
import connectflash from "connect-flash";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import authMiddleware from "./utils/authMiddleware.js";

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET;
// conncet to mongodb
connectDB();
dotenv.config();

// Init session
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);



// connectflash
app.use(connectflash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});


// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logs the http requests and resposne
app.use(morgan("dev"));

// set the view engine as ejs
app.set("view engine", "ejs");

// set the public folder static
app.use(express.static("public"));

// Middleware to decode JWT and set req.user
app.use(authMiddleware);


// Middleware to make user available in views
app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user; // Make the user object available globally in templates
  } else {
    res.locals.user = null; // Ensure user is null when not logged in
  }
  next();
});

// routes
app.use("/", index);
app.use("/user", user);
app.use("/auth", auth);

// handles all route that have not been defined in application
app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

// passes the error object to the error handler
app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  // res.send(error);
  res.render("error_404.ejs");
});

// server listening for requests
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
