import express from "express";
import User from "../models/userModel.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the signup route
const router = express.Router();

router.get("/", (req, res) => {
  res.render("signup");
});

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("hit");

  try {
    // Create a new user
    const user = new User({ username, email, password });
    await user.save();

    console.log(user);

    // Store the user's information in the session
    req.session.user = { username, email };

    res.redirect("/home");
  } catch (error) {
    res.status(500).send({ message: "Error signing up" });
  }
});

export default router;
