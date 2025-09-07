import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const API_URL = "https://ai-chatbot-backend-66k1.onrender.com/api/chat";
  // const API_URL = "http://localhost:5000/api/chat";
  // ⏳ Load chat history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_URL}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages(res.data); // backend returns role, message, timestamp
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    fetchHistory();
  }, []);

  // ⏬ Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📨 Send new message
  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", message: input, timestamp: new Date().toISOString() },
    ];
    setMessages(newMessages);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        API_URL,
        { message: input },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const botReply = res.data.reply || "No response from bot.";
      setMessages([
        ...newMessages,
        { role: "bot", message: botReply, timestamp: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error("Send message error:", err);
      setMessages([
        ...newMessages,
        {
          role: "bot",
          message: "⚠️ Error connecting to server.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    setInput("");
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🕒 Format timestamp
  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2>🤖 AI Chatbot</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* Chat box */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              margin: "5px 0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", maxWidth: "70%" }}>
              <div
                style={{
                  ...styles.message,
                  background: msg.role === "user" ? "#4CAF50" : "#f1f1f1",
                  color: msg.role === "user" ? "white" : "black",
                  borderRadius:
                    msg.role === "user"
                      ? "12px 12px 0 12px"
                      : "12px 12px 12px 0",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.message}
              </div>
              <div style={styles.timestamp}>{formatTime(msg.timestamp)}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputBox}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "600px",
    marginBottom: "10px",
  },
  logoutBtn: {
    padding: "8px 15px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  chatBox: {
    flex: 1,
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#fff",
  },
  message: {
    padding: "8px 12px",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  timestamp: {
    fontSize: "11px",
    color: "gray",
    marginTop: "2px",
  },
  inputBox: {
    display: "flex",
    width: "100%",
    maxWidth: "600px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px 0 0 8px",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "0 8px 8px 0",
    cursor: "pointer",
  },
};

export default Chat;
