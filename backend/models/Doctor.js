import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    image: { type: String, default: "" },
    speciality: { type: String, required: true },
    degree: { type: String, default: "MBBS" },
    experience: { type: String, default: "" },
    about: { type: String, default: "" },
    fees: { type: Number, min: 0, default: 0 },
    phone: { type: String, default: "" },
    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Doctor", doctorSchema);
