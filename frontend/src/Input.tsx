import React, { useState } from "react";
import "./Input.css";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const Input = () => {
  const [inputData, setInputData] = useState({
    theme: '',
    lesson: '',
  });
  const [storybook, setStorybook] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const trimmedImages = data.message.images.slice(0, data.message.storyScene.length)
      setStorybook({
        ...data.message,
        images: trimmedImages,
      })
      console.log('Storybook generated:', data.message);
    } catch (error) {
      console.error('Error generating storybook:', error);
    }
  };

  return (
    <div className="input-container">
      <h1>Children's Storybook Generator</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="theme">Theme:</label>
          <input
            type="text"
            id="theme"
            name="theme"
            value={inputData.theme}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-field">
          <label htmlFor="lesson">Lesson:</label>
          <input
            type="text"
            id="lesson"
            name="lesson"
            value={inputData.lesson}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Generate</button>
      </form>
      <Loading isGenerated={storybook === null} />
      {storybook && (
        <div className="storybook-preview">
          <h2>Generated Storybook</h2>
          {storybook.storyScene.map((scene, index) => (
            <div key={index} className="scene">
              <h2>{scene}</h2>
              {storybook.images[index] && (
                <img src={storybook.images[index]} alt={`Scene ${index + 1}`} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Input;
