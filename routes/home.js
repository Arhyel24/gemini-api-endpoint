import express from "express";

const router = express.Router();

// Endpoint for home page
router.get("/", (req, res) => {
  res.render("chat");
});

router.get("/home", async (req, res) => {
  res.send("User is active promptly");
});

export default router;
