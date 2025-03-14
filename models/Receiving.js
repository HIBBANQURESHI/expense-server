import mongoose from "mongoose";
import { Schema } from "mongoose";

const receivingSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    }
  });
  
const Receiving = mongoose.model('Receiving', receivingSchema);
export default Receiving