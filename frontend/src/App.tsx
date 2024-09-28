// App.tsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { User } from "./types";
import Navbar from "./Navbar";
import Home from "./Home";
import Profile from "./Profile";
import Create from "./Create";
import Login from "./Login";
import "./App.css";
import Loading from "./Loading";
import Output from "./Output";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  return (
<<<<<<< HEAD
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/create"
          element={user ? <Create user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile user={user} /> : <Navigate to="/login" />}
        />
        <Route path="/loading" element={<Loading />} />
        <Route path="/output" element={<Output />} />
      </Routes>
    </Router>
=======
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/profile" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/create"
            element={user ? <Create user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/loading" element={<Loading />} />
          <Route path="/output" element={<Output />} />
        </Routes>
      </Router>
    </>
>>>>>>> lucas-branch
  );
}

export default App;
