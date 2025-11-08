import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      // minlength: [2, "Name must be at least 2 characters"],
      // maxlength: [50, "Name must not exceed 50 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      // match: [/^\+?[0-9\s]{1,15}$/, "Phone must be up to 15 digits"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      // lowercase: true,
      // match: [/\S+@\S+\.\S+/, "Email must be valid"],
    },

    location: {
      type: String,
      trim: true,
      // minlength: [2, "Location must be at least 2 characters"],
      // maxlength: [100, "Location must not exceed 100 characters"],
    },

    message: {
      type: String,
      trim: true,
      // maxlength: [500, "Message must not exceed 500 characters"],
    },
    flag: {
      type: Boolean,
      default: false, // initially false
    },
    type: {
      type: String,
      enum: ["new", "sales", "support"],
      default: "new"
    }
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);




const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      // minlength: [3, "Name must be at least 3 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      // match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Mobile number is required"],
      // match: [/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"],
    },
    pinCode: {
      type: String,
      required: [true, "Pincode is required"],
    },
    landline: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    companyName: {
      type: String,
      // minlength: [3, "Company name must be at least 3 characters"],
      default: null,
    },
    staffSize: {
      type: String, // could be enum like ["1-10", "11-50", "51-200"] if you want
      default: null,
    },
    gstCertificate: {
      type: String, // store filename or file path (uploaded doc)
      required: [true, "GST Certificate is required2"],
    },
    panCard: {
      type: String, // store filename or file path
      required: [true, "PAN Card is required2"],
    },
  },
  { timestamps: true }
);

export const Partner = mongoose.model("Partner", partnerSchema);



