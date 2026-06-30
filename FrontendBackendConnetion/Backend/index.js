import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const Jokes = [
    {
        id: 1,
        title: "Joke 1",
        content: "Why don't scientists trust atoms? Because they make up everything!"
    },
    {
        id: 2,
        title: "Joke 2",
        content: "Why did the scarecrow win an award? Because he was outstanding in his field!"
    },
    {
        id: 3,
        title: "Joke 3",
        content: "Why did the bicycle fall over? Because it was two-tired!"
    },
    {
        id: 4,
        title: "Joke 4",
        content: "Why don't eggs tell jokes? They'd crack up!"
    },
    {
        id: 5,
        title: "Joke 5",
        content: "Why did the tomato turn red? Because it saw the salad dressing!"
    }
]

const PORT = process.env.PORT || 4000;

app.get("/", (req, res)=>{
 res.send("Hello from backend");
})

app.get("/api/jokes", (req, res)=>{
    res.json(Jokes);
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});