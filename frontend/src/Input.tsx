import React, { useState } from "react";
import "./Input.css";
import { useNavigate } from "react-router-dom";
import { User } from "./types";
import Loading from "./Loading";

interface InputData {
  theme: string;
  lesson: string;
}

interface InputProps {
  user: User | null; // Keep user prop to manage user authentication
}

const Input: React.FC<InputProps> = ({ user }) => {
  const [inputData, setInputData] = useState<InputData>({
    theme: "",
    lesson: "",
  });

  const [storybook, setStorybook] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not logged in.");
      return; // Prevent submission if user is not logged in
    }

    setIsGenerating(true);
    navigate("/loading", { state: { isGenerated: false } });

    try {
      const response = await fetch("http://localhost:3000/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const trimmedImages = data.message.images.slice(
        0,
        data.message.storyScene.length
      );

      const generatedStorybook = {
        ...data.message,
        images: trimmedImages,
      };
      setStorybook(generatedStorybook);

      // Add the generated storybook to the user's collection
      await fetch(`http://localhost:3000/api/books/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedStorybook),
      });

      console.log("Storybook generated:", data.message);
      setIsGenerating(false);
      navigate("/output", { state: { storybook: generatedStorybook } });
    } catch (error) {
      console.error("Error generating storybook:", error);
      setIsGenerating(false);
    }
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
