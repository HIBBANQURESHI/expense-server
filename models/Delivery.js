import mongoose from "mongoose";
import { Schema } from "mongoose";

const deliverySchema = new Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }

  }, {timestamps: true});
  
const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery