import React, { useEffect } from "react";
import "./Output.css";
import "./Slideshow";

const Output: React.FC = () => {
  useEffect(() => {
    // Hide particles on the Output page
    const particlesContainer = document.getElementById("particles-js");
    if (particlesContainer) {
      particlesContainer.style.display = "none";
    }

    // Cleanup function to restore particles when component unmounts
    return () => {
      if (particlesContainer) {
        particlesContainer.style.display = "block";
      }
    };
  }, []);

  return (
    <div className="output-container">
      <iframe
        src="/book/index.html"
        title="Flipbook"
        className="flipbook-iframe"
      ></iframe>
    </div>
  );
};

export default Output;
