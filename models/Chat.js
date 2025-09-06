import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [
    {
      role: String, // "user" or "assistant"
      content: String,
    },
  ],
});

export default mongoose.model("Chat", chatSchema);
