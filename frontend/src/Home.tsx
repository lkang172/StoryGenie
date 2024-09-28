import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleCreateClick = () => {
    navigate("/create");
  };
  return (
    <div className="home-container">
      <h1 className="h1Home">StoryGenie</h1>
      <p>
        Tired of buying expensive books, but still know the importance of
        reading with your kids? Look no further than StoryGenie: the AI
        children's storybook creator of the future.
      </p>
      <button className="buttonHome" type="submit" onClick={handleCreateClick}>
        Create A Book
      </button>
    </div>
  );
};

export default Home;
