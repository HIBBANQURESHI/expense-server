import mongoose from "mongoose";
import { Schema } from "mongoose";

const hungerSchema = new Schema({
    deliveries: {
        type: Number,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }

  }, {timestamps: true});
  
const Hunger = mongoose.model('Hunger', hungerSchema);
export default Hunger