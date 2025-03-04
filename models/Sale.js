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
        default: Date.now,
        get: function(date) {
            return date.toISOString().split('T')[0]; // Store as YYYY-MM-DD
        }
    }

  });
  
const Sale = mongoose.model('Sale', saleSchema);
export default Sale