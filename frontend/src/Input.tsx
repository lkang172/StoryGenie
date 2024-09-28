import React, { useState } from 'react';
import './Input.css'; // We'll create this file for styling

interface InputData {
  theme: string;
  characters: string;
  moralLesson: string;
}

const Input: React.FC = () => {
  const [inputData, setInputData] = useState<InputData>({
    theme: '',
    characters: '',
    moralLesson: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you can add the logic to handle the storybook generation
    console.log('Theme:', inputData.theme);
    console.log('Characters:', inputData.characters);
    console.log('Moral Lesson:', inputData.moralLesson);
    
    // You can replace this with your own logic to generate the storybook
    alert('Storybook generated! Check the console for details.');
  };

  return (
    <div className="input-container">
      <h1>Children's Storybook Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="theme">Theme:</label>
          <input
            type="text"
            id="theme"
            name="theme"
            value={inputData.theme}
            onChange={handleInputChange}
            required
            placeholder="e.g., Friendship, Adventure, Courage"
          />
        </div>
        <div>
          <label htmlFor="characters">Characters:</label>
          <input
            type="text"
            id="characters"
            name="characters"
            value={inputData.characters}
            onChange={handleInputChange}
            required
            placeholder="e.g., A brave mouse, a wise owl"
          />
        </div>
        <div>
          <label htmlFor="moralLesson">Moral Lesson:</label>
          <input
            type="text"
            id="moralLesson"
            name="moralLesson"
            value={inputData.moralLesson}
            onChange={handleInputChange}
            required
            placeholder="e.g., The importance of honesty"
          />
        </div>
        <button type="submit">Generate</button>
      </form>
    </div>
  );
};

export default Input;