import mongoose from "mongoose";
import { Schema } from "mongoose";

const noonSchema = new Schema({
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
  
const Noon = mongoose.model('Noon', noonSchema);
export default Noon