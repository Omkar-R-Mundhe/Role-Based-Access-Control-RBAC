import { configDotenv } from "dotenv";
import express from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import morgan from "morgan";
import connectDB from "./config/db.config..js";
import index from "./routes/index.route.js";
import user from "./routes/user.route.js";
import auth from "./routes/auth.route.js";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

// conncet to mongodb
connectDB();


// logs the http requests and resposne
app.use(morgan("dev"));

// set the view engine as ejs
app.set("view engine", "ejs");


// set the public folder static
app.use(express.static("public"));

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
  res.render('error_404.ejs')
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
