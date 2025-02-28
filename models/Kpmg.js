import mongoose from "mongoose";
import { Schema } from "mongoose";

const kpmgSchema = new Schema({
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
        required: true
    }

  }, {timestamps: true});
  
const Kpmg = mongoose.model('Kpmg', kpmgSchema);
export default Kpmg