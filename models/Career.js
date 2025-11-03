import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    roleApplyingFor: {
      type: String,
      required: [true, "Role applying for is required"],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      // match: [/^\+?[0-9\s]{1,15}$/, "Invalid contact number format"],
    },
    emailAddress: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      // match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    location: {
      type: String,
      trim: true,
      default: null,
    },
    coverLetter: {
      type: String,
      trim: true,
      default: null,
    },
    resume: {
      type: String, // GCS file path or public URL
      required: [true, "Resume file is required"],
    },
  },
  { timestamps: true }
);

export const Career = mongoose.model("Career", careerSchema);
