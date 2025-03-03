import mongoose from "mongoose";
import { Schema } from "mongoose";

const hungerSchema = new Schema({
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
  
const Hunger = mongoose.model('Hunger', hungerSchema);
export default Hunger