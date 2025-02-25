import mongoose from "mongoose";
import { Schema } from "mongoose";

const broozeSchema = new Schema({
    description: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }

  }, {timestamps: true});
  
const Brooze = mongoose.model('Brooze', broozeSchema);
export default Brooze