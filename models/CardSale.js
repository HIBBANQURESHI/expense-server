import mongoose from "mongoose";
import { Schema } from "mongoose";

const cardSaleSchema = new Schema({
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
  
const cardSale = mongoose.model('CardSale', cardSaleSchema);
export default cardSale