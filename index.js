const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// const OpenAI = require("openai");

// const { OpenAI } = require("openai"); // Assuming this is the package you are using

const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for all routes
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Endpoint for the chatbot API
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log(userMessage);

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
        "You are a professional developer. Your name is Shadow.",
    });

    const result = await model.generateContent(userMessage);
    // console.log(result.response.text());
    // console.log(openAIResponse);

    // const botResponse = openAIResponse.data.choices[0].text.trim();
    const response = await result.response;
    const text = response.text();
    console.log(`Ai responded`);

    return res.json({ response: text });
  } catch (error) {
    console.error("Error with chatbot API:", error);
    return res.status(500).json({ error: "Failed to generate a response" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
