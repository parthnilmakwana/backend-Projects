    import { Router } from "express";
    import { getJokes, createJoke, createJokes } from "../controllers/jokes.controller.js";

    const router = Router();

    router.route("/jokes").get(getJokes);
    router.route("/jokes").post(createJoke);
    router.route("/jokes/many").post(createJokes);

    export default router;