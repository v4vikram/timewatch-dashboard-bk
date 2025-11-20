import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  filename: String,
  url: String,        // GCS public URL
  path: String,       // folder path: uploads/products, uploads/docs etc
  type: String,       // image/png, application/pdf
  size: Number,       // KB
  uploadedBy: String, // user id (optional)
}, { timestamps: true });

export default mongoose.model("Media", mediaSchema);
