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
    }
  }, {timestamps: true});
  
const Receiving = mongoose.model('Receiving', receivingSchema);
export default Receiving