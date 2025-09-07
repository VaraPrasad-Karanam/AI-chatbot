import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./Chat";
import Login from "./Login";
import Register from "./Register";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protect chat route */}
        <Route
          path="/chat"
          element={token ? <Chat /> : <Navigate to="/login" />}
        />
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
