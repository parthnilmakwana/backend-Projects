import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

import jokesRoutes from "./routes/jokes.routes.js";

app.use("/api/v1", jokesRoutes);

export default app;