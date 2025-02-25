import mongoose from "mongoose";
import { Schema } from "mongoose";

const kpmgSchema = new Schema({
    description: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }

  }, {timestamps: true});
  
const Kpmg = mongoose.model('Kpmg', kpmgSchema);
export default Kpmg