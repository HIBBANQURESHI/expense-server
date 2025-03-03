import mongoose from "mongoose";
import { Schema } from "mongoose";

const expenseSchema = new Schema({
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
  
const Expense = mongoose.model('Expense', expenseSchema);
export default Expense