import bcrypt from 'bcryptjs';
import validator from "validator";
import { IUser } from '../interfaces/user.interface';
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    username: { 
      type: String, 
      required: true,
      unique: true,
      lowercase: true, 
      trim: true 
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    type: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      }
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password as string, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>("User", userSchema);