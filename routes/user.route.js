import express from "express";
import authMiddleware from "../utils/authMiddleware.js";
const router = express.Router();


router.get("/profile", authMiddleware, (req, res) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to access this page.");
    res.redirect("/auth/login");
    return
  }
  res.render("profile");
});

export default router;
