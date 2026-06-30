import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
import dns from "dns"

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])


const connectDB = async() =>{
try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    console.log(`MongoDB connected successfully: ${connectionInstance.connection.host}`)
} catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
}
}

export default connectDB;