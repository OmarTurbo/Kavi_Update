import mongoose, { Schema } from "mongoose";
import { IMessage } from "../interfaces";

const messageSchema = new Schema<IMessage>({
  firstName: { 
    type: String, 
    trim: true,
    required: true 
  },
  lastName: { 
    type: String,
    required: true,
    trim: true,  
  },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  nationality: { type: String, required: true },
  message: { type: String, required: true },

  reply: { type: String, default: "" },
  status: { type: String, enum: ["pending", "replied"], default: "pending" },
},
{ timestamps: true }
);

export default mongoose.model<IMessage>("Message", messageSchema);