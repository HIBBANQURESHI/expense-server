import mongoose from "mongoose";
import { Schema } from "mongoose";

const marsoolSchema = new Schema({
    deliveries: {
        type: Number,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }

  }, {timestamps: true});
  
const Marsool = mongoose.model('Marsool', marsoolSchema);
export default Marsool