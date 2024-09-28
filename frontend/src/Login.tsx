import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "./types";
import "./Input.css";

interface LoginProps {
  onLogin: (userData: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const userData = await response.json();
        onLogin(userData);
        navigate("/profile"); // or wherever you want to redirect after login
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        // Handle login error (e.g., show error message to user)
      }
    } catch (error) {
      console.error("Login error:", error);
      // Handle network or other errors
    }
  };
  return (
    <div className="input-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
