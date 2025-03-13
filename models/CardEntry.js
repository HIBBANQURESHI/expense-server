import mongoose from "mongoose";

const cardEntrySchema = new mongoose.Schema({
  name: String,
  description: String,
  amount: Number,
  type: {
    type: String,
    enum: ['debit', 'credit']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('CardEntry', cardEntrySchema);