import mongoose from "mongoose";
import { Schema } from "mongoose";

const keetaSchema = new Schema({
    deliveries: { type: Number, required: true },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balance: { 
        type: Number, 
        default: function() { return this.amount - this.paidAmount }
    },
    date: { type: Date, required: true }
});
  
const Keeta = mongoose.model('Keeta', keetaSchema);
export default Keeta