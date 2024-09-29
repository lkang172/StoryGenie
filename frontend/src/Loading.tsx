import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Loading.css";

const Loading: React.FC = () => {
  const messages = [
    "Generating your story...",
    "Coming up with a plot...",
    "Consulting the wise old owl...",
    "Taking a washroom break...",
    "Watching the debate...",
    "Talking to dragons for advice...",
    "Generating the illustrations...",
    "Mixing up a magic potion...",
    "Procastinating...",
  ];
  const [loadingMessage, setLoadingMessage] = useState(messages[0]);
  const navigate = useNavigate();
  const location = useLocation();

  const { isGenerated } = location.state || { isGenerated: false };

  useEffect(() => {
    const timer = setInterval(() => {
      const displayMessage =
        messages[Math.floor(Math.random() * messages.length)];
      setLoadingMessage(displayMessage);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // If the storybook is generated, navigate to the output page
    if (isGenerated) {
      navigate("/output");
    }
  }, [isGenerated, navigate]);

  return (
    <div className="loading-container">
      <h2 className="h2Home">{loadingMessage}</h2>
      <div className="spinner"></div>
    </div>
  );
};

export default Loading;
