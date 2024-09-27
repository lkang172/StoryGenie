import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Hello world</h1>
      <h2>Hello world again!</h2>
      <h3>Hello world 3</h3>
    </>
  );
}

export default App;
