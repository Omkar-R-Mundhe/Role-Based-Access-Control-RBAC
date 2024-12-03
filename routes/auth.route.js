import express from "express";
import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

// login page
router.get("/login", async (req, res) => {
  res.render("Login");
});

// register page
router.get("/register", async (req, res) => {
  res.render("register");
});

// check the login credentials
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // check if the user is present
    if (!user) {
      req.flash("error", "Invalid credentials");
      res.render("login", { messages: req.flash() });
      return;
    }

    // check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      req.flash("error", "Invalid credentials");
      res.render("login", { messages: req.flash() });
      return;
    }

    // create the jwt sign 
    const token = jwt.sign({ userId: user._id,user:user.username}, process.env.JWT_SECRET, {
      expiresIn: "1m"
    });
    
    res.cookie("token", token, { httpOnly: true });
    console.log("logged in successfully");
    console.log(token)
    res.render("profile",{token});
  } catch (error) {
    next(error);
  }
});

// register the new user
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password, password2 } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.flash("error", "Email is already registered.");
      return res.redirect("/auth/register"); // Redirect back to the registration form
    }

    // Validate the password (example validation)
    if (!password || password.length < 6) {
      req.flash("error", "Password must be at least 6 characters long.");
      return res.render("register", {
        username: req.body.username,
        email: req.body.email,
        messages: req.flash(),
      });
    }

    // if password doesnt match
    if (password != password2) {
      req.flash("error", "Password does not match");
      return res.render("register", {
        username: req.body.username,
        email: req.body.email,
        messages: req.flash(),
      });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    console.log("User saved:", savedUser);

    // Redirect to login page after successful registration
    req.flash(
      "success",
      `${username} you have successfully registered! now you can login`
    );
    res.render("login", {
      messages: req.flash(),
    });
  } catch (error) {
    next(error); // Pass errors to error-handling middleware
  }
});

// logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("logout");
});

export default router;
