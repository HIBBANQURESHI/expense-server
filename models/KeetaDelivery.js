import mongoose from "mongoose";
import { Schema } from "mongoose";

const keetaSchema = new Schema({
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
  
const Keeta = mongoose.model('Keeta', keetaSchema);
export default Keeta