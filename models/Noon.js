import mongoose from "mongoose";
import { Schema } from "mongoose";

const noonSchema = new Schema({
    deliveries: {
        type: Number,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }

  }, {timestamps: true});
  
const Noon = mongoose.model('Noon', noonSchema);
export default Noon