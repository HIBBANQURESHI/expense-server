import mongoose from "mongoose";
import { Schema } from "mongoose";

const ninjaSchema = new Schema({
    deliveries: {
        type: Number,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        required: true // Ensures every document has a date
    }

  });
  
const Ninja = mongoose.model('Ninja', ninjaSchema);
export default Ninja