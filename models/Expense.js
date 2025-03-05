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
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'card'],
        default: 'cash'
    }
});
  
const Expense = mongoose.model('Expense', expenseSchema);
export default Expense