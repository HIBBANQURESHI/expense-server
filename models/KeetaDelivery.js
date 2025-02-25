import mongoose from "mongoose";
import { Schema } from "mongoose";

const keetaSchema = new Schema({
    deliveries: {
        type: Number,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }

  }, {timestamps: true});
  
const Keeta = mongoose.model('Keeta', keetaSchema);
export default Keeta