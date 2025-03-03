import mongoose from "mongoose";
import { Schema } from "mongoose";

const marsoolSchema = new Schema({
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
  
const Marsool = mongoose.model('Marsool', marsoolSchema);
export default Marsool