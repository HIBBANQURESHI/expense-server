import mongoose from "mongoose";
import { Schema } from "mongoose";

const ninjaSchema = new Schema({
    deliveries: {
        type: Number,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }

  }, {timestamps: true});
  
const Ninja = mongoose.model('Ninja', ninjaSchema);
export default Ninja