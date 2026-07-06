import { Joke } from "../models/jokes.models.js";

const getJokes = async (req, res) => {
  try {
    const jokes = await Joke.find();
    if (!jokes.length) {
      return res.status(404).json({ message: "No jokes found" });
    }
    res.status(200).json(jokes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jokes", error: error.message });
  }
};

const createJoke = async (req, res) => {
  try {
    const { joke } = req.body;
    if (!joke) {
      return res.status(400).json({ message: "Joke is required" });
    }
    const newJoke = await Joke.create({ joke });

    res.status(201).json(newJoke);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating joke", error: error.message });
  }
};

const createJokes = async (req, res) => {
  try {
    const jokes = req.body;
    if (!jokes || jokes.length === 0 || !Array.isArray(jokes)) {
      return res.status(400).json({ message: "Invalid jokes data" });
    }
    const newJokes = await Joke.insertMany(jokes);
    res.status(201).json(newJokes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating jokes", error: error.message });
  }
};

const getJokeById = async (req, res) => {
  try {
    const { id } = req.params;
    const joke = await Joke.findById(id);
    if (!joke) {
      return res.status(404).json({ message: "Joke not found" });
    }
    res.status(200).json(joke);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching joke", error: error.message });
  }
};

const getRandomJoke = async (req, res) => {
    try{
const randomJoke = await Joke.aggregate([{ $sample: { size: 1 } }]);
if (!randomJoke.length) {
    return res.status(404).json({ message: "No jokes found" });
}
res.status(200).json(randomJoke[0]);

    }catch(error){
        res.status(500).json({ message: "Error fetching random joke", error: error.message });
    }
}

export { getJokes, createJoke, createJokes, getJokeById, getRandomJoke };
