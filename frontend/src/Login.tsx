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
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
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
        navigate("/profile"); // Redirect after login
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Display error to the user
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerUsername,
          password: registerPassword,
        }), // Use signup state variables
      });
      if (response.ok) {
        const userData = await response.json();
        onLogin(userData); // Automatically log in after signup
        navigate("/profile"); // Redirect after signup/login
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed"); // Display error to the user
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="input-container">
      {/* Login Form */}
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
        {error && <p className="error">Login failed</p>}
        <button type="submit" className="loginbutton">
          Login
        </button>
      </form>

      {/* Signup Form */}
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          value={registerUsername}
          onChange={(e) => setRegisterUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="loginbutton">
          Register
        </button>
      </form>
    </div>
  );
};

export default Login;
