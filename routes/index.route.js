import express from "express";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/",(req, res) => {
  console.log("On first page ");
  res.render("index");
});

export default router;
