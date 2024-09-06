import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Endpoint for chatbot API
router.post("/", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const model = new GoogleGenerativeAI(
      process.env.GEMINI_KEY
    ).getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const result = await model.generateContent(userMessage);
    const response = result.response;
    const text = response.text();
    return res.json({ response: text });
  } catch (error) {
    // console.error("Error with chatbot API:", error);
    return res.status(500).json({ error: "Failed to generate a response" });
  }
});

export default router;
