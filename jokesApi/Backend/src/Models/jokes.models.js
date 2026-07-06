import mongoose, {Schema} from "mongoose";

const jokesSchema = new Schema({
    joke : {
        type : String,
        required: true
    }
},
{
timestamps: true
})

export const Joke = mongoose.model("Joke", jokesSchema);