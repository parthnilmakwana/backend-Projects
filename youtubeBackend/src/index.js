import "./constants.js"
import connectDB from "./db/index.js"
import app from "./app.js"




connectDB().then(()=>{
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})
}).catch((err)=>{
    console.error("Failed to connect to the database", err)
    throw err
})