import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dns from "dns";

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;