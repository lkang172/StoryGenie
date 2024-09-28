import React, { useState } from "react";
import "./Input.css";
import { useNavigate } from "react-router-dom";

interface InputData {
  theme: string;
  lesson: string;
}

const Input: React.FC = () => {
  const [inputData, setInputData] = useState<InputData>({
    theme: "",
    lesson: "",
  });

  // Call useNavigate here, at the top of the component
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you can add the logic to handle the storybook generation
    console.log("Theme:", inputData.theme);
    console.log("Lesson:", inputData.lesson);

    // Navigate to the Loading page after handling input
    navigate("/loading");

    // You can replace this with your own logic to generate the storybook
    alert("Storybook generated! Check the console for details.");
  };

  return (
    <div className="input-container">
      <h1>Children's Storybook Generator</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label htmlFor="theme">Theme:</label>
          <input
            type="text"
            id="theme"
            name="theme"
            value={inputData.theme}
            onChange={handleInputChange}
            required
            placeholder="e.g. Fantasy, Adventure, Coming-of-age"
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="lesson">Lesson:</label>
          <input
            type="text"
            id="lesson"
            name="lesson"
            value={inputData.lesson}
            onChange={handleInputChange}
            required
            placeholder="e.g. Kindness is contagious, Be the change in the world"
          />
        </div>
        <button className="button" type="submit">
          Generate
        </button>
      </form>
    </div>
  );
};

export default Input;
