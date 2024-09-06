import authMiddleware from "../middlewares/authmiddleware.js";
import express from "express";

const router = express.Router();

// Endpoint for home page
router.get("/", authMiddleware, (req, res) => {
  res.render("chat");
});

router.get("/home", async (req, res) => {
  res.render("home");
});

export default router;
