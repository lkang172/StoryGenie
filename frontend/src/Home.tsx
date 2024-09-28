import React, { useState } from "react";
import "./Home.css";

interface InputData {
  theme: string;
  lesson: string;
}

const Home: React.FC = () => {
  const [inputData, setInputData] = useState<InputData>({
    theme: "",
    lesson: "",
  });

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

    // You can replace this with your own logic to generate the storybook
    alert("Storybook generated! Check the console for details.");
  };

  return (
    <div className="home-container">
      <h1>Children's Storybook Generator</h1>

      <button className="button" type="submit">
        Create A Book
      </button>
    </div>
  );
};

export default Home;
