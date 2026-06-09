import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 80,
      default: ""
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
