import { useLocation } from "react-router-dom";
import "./Output.css";

const Output: React.FC = () => {
  const location = useLocation();
  const storybook = location.state?.storybook;

  if (!storybook) {
    return <div>No storybook available. Please generate a story first.</div>;
  }

  return (
    <div className="output-container">
      <center>
        <h1>Your Generated Storybook</h1>
        {storybook.storyScene.map((scene: string, index: number) => (
          <div key={index} className="story-section">
            <h2>Page {index + 1}:</h2>
            <p>{scene}</p>
            {storybook.images[index] && (
              <img src={storybook.images[index]} alt={`Scene ${index + 1}`} />
            )}
          </div>
        ))}
      </center>
    </div>
  );
};

export default Output;
