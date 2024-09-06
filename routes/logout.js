import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Endpoint for logout
router.get("/", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.send("Logged out successfully!");
  });
});

export default router;
