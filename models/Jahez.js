import mongoose from "mongoose";
import { Schema } from "mongoose";

const jahezSchema = new Schema({
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
  
const Jahez = mongoose.model('Jahez', jahezSchema);
export default Jahez