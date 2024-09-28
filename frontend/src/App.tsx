import { useState } from "react";
import Navbar from "./Navbar";
import Home from "./Home.tsx";
import Profile from "./Profile";
import Create from "./Create";
import "./App.css";
import HomeContainer from "./HomeContainer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
