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

app.use((req, res, next) => {
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })(req, res, next);
});

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import userRoutes from "./routes/user.router.js";
import todoRoutes from "./routes/todos.router.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/todos", todoRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export default app;
