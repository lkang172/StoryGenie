import React, { useState } from "react";
import "./Input.css";
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
const Input = () => {
  const [inputData, setInputData] = useState({
    theme: '',
    lesson: '',
=======
interface InputData {
  theme: string;
  lesson: string;
}

const Input: React.FC = () => {
  const [inputData, setInputData] = useState<InputData>({
    theme: "",
    lesson: "",
>>>>>>> 4b12fcd88b00078940d79dac8b3612180291788c
  });
  const [storybook, setStorybook] = useState(null);

<<<<<<< HEAD
  const handleInputChange = (e) => {
=======
  // Call useNavigate here, at the top of the component
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
>>>>>>> 4b12fcd88b00078940d79dac8b3612180291788c
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
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
      setStorybook(data.message);
      console.log('Storybook generated:', data.message);
    } catch (error) {
      console.error('Error generating storybook:', error);
    }
=======
    // Here you can add the logic to handle the storybook generation
    console.log("Theme:", inputData.theme);
    console.log("Lesson:", inputData.lesson);

    // Navigate to the Loading page after handling input
    navigate("/loading");

    // You can replace this with your own logic to generate the storybook
    alert("Storybook generated! Check the console for details.");
>>>>>>> 4b12fcd88b00078940d79dac8b3612180291788c
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
<<<<<<< HEAD
          />
        </div>
        <button type="submit">Generate</button>
=======
            placeholder="e.g. Kindness is contagious, Be the change in the world"
          />
        </div>
        <button className="button" type="submit">
          Generate
        </button>
>>>>>>> 4b12fcd88b00078940d79dac8b3612180291788c
      </form>
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
