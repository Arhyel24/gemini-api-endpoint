import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
// const { mime } = require("mime");
import { Mime } from "mime";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// Load the environment variables
dotenv.config();

// const { OpenAI } = require("openai"); // Assuming this is the package you are using

import cors from "cors";
import { fileURLToPath } from "url";

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const customMime = new Mime();

// Define custom MIME types
customMime.define(
  {
    "text/css": ["css"],
    "application/javascript": ["js"],
    "image/png": ["png"],
    "image/jpeg": ["jpg", "jpeg"],
    "image/gif": ["gif"],
  },
  true
);

app.use(cors()); // Enable CORS for all routes

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Middleware to serve static files from the 'public' folder
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, filePath) => {
      // Set the correct MIME type using the custom Mime instance
      const type = customMime.getType(filePath);
      if (type) {
        res.setHeader("Content-Type", type);
      }
    },
  })
);

app.use((req, res, next) => {
  console.log("hit 1");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", async (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

// Endpoint for the chatbot API
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  // console.log(userMessage);

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Example using OpenAI's API - replace `YOUR_API_KEY` with your actual OpenAI API key
    // const openAIResponse = await axios.post(
    //   "https://api.openai.com/v1/chat/completions",
    //   {
    //     model: "text-davinci-003",
    //     prompt: userMessage,
    //     max_tokens: 150,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer `,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // const completion = await openai.chat.completions.create({
    //   messages: [{ role: "user", content: userMessage }],
    //   model: "gpt-3.5-turbo",
    // });

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "You are a professional web developer. Your name is Shadow.",
    });

    const result = await model.generateContent(userMessage);
    // console.log(result.response.text());
    // console.log(openAIResponse);

    // const botResponse = openAIResponse.data.choices[0].text.trim();
    const response = await result.response;
    const text = response.text();
    // console.log(`Ai responded`);

    return res.json({ response: text });
  } catch (error) {
    console.error("Error with chatbot API:", error);
    return res.status(500).json({ error: "Failed to generate a response" });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// Export the Express app as a serverless function
export default app;
