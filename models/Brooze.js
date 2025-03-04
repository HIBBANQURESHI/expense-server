import mongoose from "mongoose";
import { Schema } from "mongoose";

const broozeSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    credit: {
        type: Number,
        required: true
    },

    balance: {
        type: Number,
        required: false,
        default: 0
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    }

  });
  
const Brooze = mongoose.model('Brooze', broozeSchema);
export default Brooze