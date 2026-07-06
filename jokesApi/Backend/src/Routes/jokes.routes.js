    import { Router } from "express";
    import { getJokes, createJoke, createJokes, getJokeById } from "../controllers/jokes.controller.js";

    const router = Router();

    router.route("/jokes").get(getJokes);
    router.route("/jokes").post(createJoke);
    router.route("/jokes/:id").get(getJokeById);
    router.route("/jokes/many").post(createJokes);

    export default router;