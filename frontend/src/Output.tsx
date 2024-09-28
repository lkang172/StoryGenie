<<<<<<< HEAD
import React, { useEffect } from 'react';
import './Output.css';

const Output: React.FC = () => {
  useEffect(() => {
    // Hide particles on the Output page
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
      particlesContainer.style.display = 'none';
    }

    // Cleanup function to restore particles when component unmounts
    return () => {
      if (particlesContainer) {
        particlesContainer.style.display = 'block';
      }
    };
  }, []);

=======
import React, { useEffect } from "react";
import "./Output.css";

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

>>>>>>> lucas-branch
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
