import express from "express";
import ChatMessage from "../models/ChatMessage.js";
import fetch from "node-fetch"; // for Gemini API
import jwt from "jsonwebtoken";

const router = express.Router();

// Chat endpoint
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { message } = req.body;

    // Save user message
    const userMsg = new ChatMessage({
      userId: decoded.id,
      role: "user",
      message,
    });
    await userMsg.save();

    // Fetch last 5 messages for context
    const history = await ChatMessage.find({ userId: decoded.id })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();

    // Format history properly for Gemini
    const contents = history.reverse().map((msg) => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.message }],
    }));

    // Add the new user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    const botReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.outputText ||
      "Sorry, I didn’t understand.";

    // Save bot message
    const botMsg = new ChatMessage({
      userId: decoded.id,
      role: "bot",
      message: botReply,
    });
    await botMsg.save();

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

// Get chat history
router.get("/history", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const history = await ChatMessage.find({ userId: decoded.id }).sort({
      timestamp: 1,
    });
    res.json(history);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
