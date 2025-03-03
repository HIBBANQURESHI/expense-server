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
    },

    date: {
        type: Date,
        required: true // Ensures every document has a date
    }

  });
  
const cardSale = mongoose.model('CardSale', cardSaleSchema);
export default cardSale