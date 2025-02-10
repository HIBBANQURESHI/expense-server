import mongoose from "mongoose";
import { Schema } from "mongoose";

const parcelSchema = new Schema({
    description: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    recevied: {
        type: Number,
        required: true
    },

    remaining: {
        type: Number,
        required: true
    }

  }, {timestamps: true});
  
const Parcel = mongoose.model('Parcel', parcelSchema);
export default Parcel