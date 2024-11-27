import express from "express";
const router = express.Router();


 router.get("/", (req, res) => {
   console.log("On first page ");
   res.render("index");
 });

export default router;
