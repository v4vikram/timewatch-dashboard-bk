import mongoose from "mongoose";

const landingPopupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const LandingPopup = mongoose.model("LandingPopup", landingPopupSchema);
export default LandingPopup;
