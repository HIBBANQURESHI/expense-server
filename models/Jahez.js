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
    }

  }, {timestamps: true});
  
const Jahez = mongoose.model('Jahez', jahezSchema);
export default Jahez