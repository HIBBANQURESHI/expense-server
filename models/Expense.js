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
    }

  }, {timestamps: true});
  
const Expense = mongoose.model('Expense', expenseSchema);
export default Expense