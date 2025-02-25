import mongoose from "mongoose";
import { Schema } from "mongoose";

const loanSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    received: {
        type: Number,
        required: true
    },

    remaining: {
        type: Number,
        required: true
    }

  }, {timestamps: true});
  
const Loan = mongoose.model('Loan', loanSchema);
export default Loan