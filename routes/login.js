import express from "express";
import User from "../models/userModel.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Endpoint for login submission
// Login route
router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Store the user's information in the session
    req.session.user = { username, email };

    // Redirect to the original URL that initiated the login route
    const returnUrl = req.session.returnUrl;
    delete req.session.returnUrl;
    res.redirect(returnUrl || "/");
  } catch (error) {
    res.status(500).send({ message: "Error logging in" });
  }
});

// Middleware to store the original URL in the session
router.use((req, res, next) => {
  if (!req.session.returnUrl) {
    req.session.returnUrl = req.headers.referer;
  }
  next();
});

export default router;
