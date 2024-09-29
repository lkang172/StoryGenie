import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Book.css";

const Storybook: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const storybook = location.state?.storybook;
  const [currentPage, setCurrentPage] = useState(0);

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < storybook.storyScene.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  if (!storybook) {
    return (
      <div>
        <p>No storybook available. Please generate one first.</p>
        <button onClick={() => navigate("/")}>Go back</button>
      </div>
    );
  }
  return (
    <div className="storybook-container">
      <div className="page">
        <h2>Scene {currentPage + 1}</h2>
        {storybook.images[currentPage] && (
          <img
            src={storybook.images[currentPage]}
            alt={`Scene ${currentPage + 1}`}
          />
        )}
        <p>{storybook.storyScene[currentPage]}</p>
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous
        </button>

        <span>
          Page {currentPage + 1} of {storybook.storyScene.length}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === storybook.storyScene.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default Storybook;
