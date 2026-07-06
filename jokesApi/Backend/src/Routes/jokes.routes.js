    import { Router } from "express";
    import { getJokes, createJoke, createJokes, getJokeById, getRandomJoke} from "../controllers/jokes.controller.js";

    const router = Router();

    router.route("/jokes").get(getJokes);
    router.route("/jokes").post(createJoke);
    router.route("/jokes/many").post(createJokes);
    router.route("/jokes/random").get(getRandomJoke);
    
    router.route("/jokes/:id").get(getJokeById);
    export default router;