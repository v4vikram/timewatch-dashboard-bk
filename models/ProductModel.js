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

// ✅ Add compound index for faster find() + sort()
// productSchema.index({
//   isDeleted: 1,
//   categoryName: 1,
//   subCategoryName: 1,
//   display_order: 1
// });

// For product detail page
productSchema.index({ productSlug: 1, isDeleted: 1 });

// For category/subcategory listing
productSchema.index({
  categorySlug: 1,
  subCategorySlug: 1,
  isDeleted: 1,
  display_order: 1
});

// For homepage / product lists
productSchema.index({ isDeleted: 1, createdAt: -1 });

// For filtering
productSchema.index({ status: 1 });
productSchema.index({ categorySlug: 1, status: 1 });
productSchema.index({ subCategorySlug: 1, status: 1 });


const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
