import { useLocation } from "react-router-dom";
import Storybook from "./components/Storybook";

const Output: React.FC = () => {
  const location = useLocation();
  const storybook = location.state?.storybook;

  if (!storybook) {
    return <div>No storybook available. Please generate a story first.</div>;
  }

  return (
    <div className="output-container">
      {storybook ? (
        <Storybook />
      ) : (
        <p>No storybook available. Please generate one first</p>
      )}
    </div>
  );
};

export default Output;
