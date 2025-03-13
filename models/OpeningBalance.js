import mongoose from "mongoose";

const openingBalanceSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  description: String
}, { timestamps: true });

const OpeningBalance = mongoose.model('OpeningBalance', openingBalanceSchema);
export default OpeningBalance;