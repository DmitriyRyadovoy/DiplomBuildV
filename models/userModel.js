import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    patronymic: {
      type: String,
      required: false,
      trim: true,
      default: ''
    },
    surname: {
      type: String,
      required: false,
      trim: true,
      default: ''
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: String,
      required: false,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    role: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
