import React, { useState } from "react";
import "./Slideshow.css"; // Ensure to include the updated CSS styles

interface SlideshowProps {
  images: string[];
  captions: string[];
}

const Slideshow: React.FC<SlideshowProps> = ({ images, captions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 2) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 2 + images.length) % images.length
    );
  };

  return (
    <div className="slideshow-wrapper">
      <div className="slideshow-container">
        <button className="slide-button left" onClick={handlePrevious}>
          &lt;
        </button>

        <div className="slides">
          <div className="slide">
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="slideshow-image"
            />
            <p className="caption">
              {captions[currentIndex] || "No caption available"}
            </p>
          </div>
          {currentIndex + 1 < images.length && (
            <div className="slide">
              <img
                src={images[currentIndex + 1]}
                alt={`Slide ${currentIndex + 2}`}
                className="slideshow-image"
              />
              <p className="caption">
                {captions[currentIndex + 1] || "No caption available"}
              </p>
            </div>
          )}
        </div>

        <button className="slide-button right" onClick={handleNext}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Slideshow;
