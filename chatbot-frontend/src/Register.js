import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://ai-chatbot-backend-66k1.onrender.com";
const handleRegister = async () => {
  try {
    await axios.post(`${API_URL}/api/auth/register`, {
      username,
      email,
      password,
    });
    navigate("/login"); // redirect to login after registration
  } catch (err) {
    setError("Registration failed. Try another email.");
  }
};


  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleRegister} style={styles.button}>Register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Already have an account?{" "}
        <span style={styles.link} onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" },
  input: { margin: "10px", padding: "10px", width: "250px" },
  button: { padding: "10px 20px", background: "#4CAF50", color: "white", border: "none", cursor: "pointer" },
  link: { color: "blue", cursor: "pointer" },
};

export default Register;
