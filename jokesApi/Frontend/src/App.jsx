import "./App.css";
import Button from "../src/Components/Button";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [joke, setJoke] = useState(null);
   const randomJokes = async () => {
    console.log("randomJokes function called");
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/jokes/random",
        );
        setJoke(response.data);
        
      } catch (error) {
        console.error("Error fetching joke:", error);
      }
    };

  useEffect(() => {
   randomJokes();
  }, []);

  return (
    <>
      <h1> hello from frontend </h1>
      <p>{joke?.joke}</p>
<Button text="Get Random Joke" onClick={randomJokes} />
    </>
  );
}

export default App;
