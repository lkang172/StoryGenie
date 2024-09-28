import React from "react";
import "./Loading.css";

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <h2 className="h2Home">Generating...</h2>
      <div className="spinner"></div>
    </div>
  );
};

export default Loading;
