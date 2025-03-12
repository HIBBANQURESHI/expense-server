import mongoose from "mongoose";

const openingBalanceSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: String
});

const OpeningBalance = mongoose.model('OpeningBalance', openingBalanceSchema);
export default OpeningBalance;