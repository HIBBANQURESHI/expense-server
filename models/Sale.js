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
    }

  }, {timestamps: true});
  
const Sale = mongoose.model('Sale', saleSchema);
export default Sale