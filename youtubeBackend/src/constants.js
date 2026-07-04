import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

console.log("Loaded:", process.env.CLOUDINARY_API_KEY);

export const DB_NAME = "videotube";
