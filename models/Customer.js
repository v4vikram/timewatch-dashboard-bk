import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must not exceed 50 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      match: [/^\+?[0-9\s]{1,15}$/, "Phone must be up to 15 digits"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email must be valid"],
    },

    location: {
      type: String,
      trim: true,
      minlength: [2, "Location must be at least 2 characters"],
      maxlength: [100, "Location must not exceed 100 characters"],
    },

    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message must not exceed 500 characters"],
    },
      type:{
      type: String,
      enum:["new","sales","support"],
      default:"new"
    }
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
