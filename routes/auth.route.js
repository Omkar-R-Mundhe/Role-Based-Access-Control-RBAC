import express from "express";
const router = express.Router();

// get the login page 
router.get("/login", async (req, res) => {
  res.send("Login");
});

// get the register page 
router.get("/register", async (req, res) => {
  res.send("register");
});

// send the login data 
router.post("/login", async (req, res) => {
  res.send("login data send");
});

// send the new user data 
router.post("/register", async (req, res) => {
  res.send("registerd data send");
});

// logout 
router.get("/logout", async (req, res) => {
  res.send("logout");
});

export default router;
