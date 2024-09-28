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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: { username },
          password: { password },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        onLogin({
          username: data.username,
          _id: data._id,
          name: data.name,
          books: data.books,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
        navigate("/create");
      } else {
        // Handle login error
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const userData = await response.json();
        onLogin(userData); // Pass the entire user data object
        navigate("/profile");
      } else {
        // Handle login error
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="input-container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          type="text"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          placeholder="Password"
          required
        />
        <button type="submit" className="button" onClick={handleLoginSubmit}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
