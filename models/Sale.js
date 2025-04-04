import mongoose from "mongoose";
import { Schema } from "mongoose";

const saleSchema = new Schema({
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
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        required: true,
        default: 'cash'
    }

  });
  
const Sale = mongoose.model('Sale', saleSchema);
export default Sale