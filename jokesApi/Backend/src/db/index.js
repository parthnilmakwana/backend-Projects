import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dns from "dns";

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);


const connectDB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("Connected to MongoDB", connectInstance.connection.host);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export default connectDB;