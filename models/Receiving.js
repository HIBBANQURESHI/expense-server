import mongoose from "mongoose";
import { Schema } from "mongoose";

const receivingSchema = new Schema({
    name: {
        type: String,
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
  
const Receiving = mongoose.model('Receiving', receivingSchema);
export default Receiving