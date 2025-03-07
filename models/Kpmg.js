import mongoose from "mongoose";
import { Schema } from "mongoose";

const kpmgSchema = new Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    credit: { type: Number, default: 0, min: 0 },
    balance: { type: Number, default: 0, min: 0 },
    date: { type: Date, required: true, default: Date.now }
 });
  
const Kpmg = mongoose.model('Kpmg', kpmgSchema);
export default Kpmg