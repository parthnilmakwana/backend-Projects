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
    <div className="flex flex-col items-center justify-center h-screen bg-black">

      <h1 className="text-white"> hello from frontend </h1>
      <p className="text-white">{joke?.joke}</p>
<Button  text="Get Random Joke" className="m-4" onClick={randomJokes}  />
    </div>
    </>
  );
}

export default App;
