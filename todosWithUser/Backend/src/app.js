import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  express.json({
    limit: "16kb",
  }),
);

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import userRoutes from "./routes/user.router.js";
import todoRoutes from "./routes/todos.router.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/todos", todoRoutes);

export default app;
