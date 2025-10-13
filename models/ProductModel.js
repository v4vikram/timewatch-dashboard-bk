import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  status: String,
  categoryName: String,
  categorySlug: String,
  subCategoryName: String,
  subCategorySlug: String,
  productName: String,
  productSlug: String,
  description: String,
  datasheetFile: String,
  connectionDiagramFile: String,
  userManualFile: String,
  productImage: String,
  productkeywords: String,
  isFeatured: Boolean,

  // New fields for ordering
  position: { type: Number, default: 0 }, // product order inside subcategory
  subCategoryPosition: { type: Number, default: 0 }, // subcategory order in category
  display_order: { type: Number, default: 0 }, // ✅ new field for ordering

  productFaq: [
    { column1: String, column2: String }
  ],

  features: [
    { title: String, image: String }
  ],

  table: [
    { column1: String, column2: String }
  ],

  // ✅ New field: key features (optional)
  keyFeatures: [
    { type: String }
  ],

  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
