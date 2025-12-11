import mongoose from "mongoose";

// BASE CDN URL
// const BASE_URL = "http://localhost:3001";
// const BASE_URL = "http://72.60.202.56:3001";
const BASE_URL = "https://www.timewatchindia.com";

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


productSchema.virtual("productImageUrl").get(function () {
  return this.productImage ? BASE_URL + this.productImage : null;
});

// ---------- FEATURES IMAGES ----------
productSchema.virtual("featuresWithUrl").get(function () {
  if (!this.features) return [];

  return this.features.map(f => ({
    ...f,
    imageUrl: f.image ? BASE_URL + f.image : null
  }));
});

// ---------- FILE URLS ----------
productSchema.virtual("datasheetFileUrl").get(function () {
  return this.datasheetFile ? BASE_URL + this.datasheetFile : null;
});

productSchema.virtual("connectionDiagramFileUrl").get(function () {
  return this.connectionDiagramFile ? BASE_URL + this.connectionDiagramFile : null;
});

productSchema.virtual("userManualFileUrl").get(function () {
  return this.userManualFile ? BASE_URL + this.userManualFile : null;
});

// ---------- ENABLE VIRTUALS IN JSON ----------
productSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {

    // main product image
    if (ret.productImage) {
      ret.productImage = BASE_URL + ret.productImage;
    }

    // datasheet
    if (ret.datasheetFile) {
      ret.datasheetFile = BASE_URL + ret.datasheetFile;
    }

    // connection diagram
    if (ret.connectionDiagramFile) {
      ret.connectionDiagramFile = BASE_URL + ret.connectionDiagramFile;
    }

    // user manual
    if (ret.userManualFile) {
      ret.userManualFile = BASE_URL + ret.userManualFile;
    }

    // features image inside array
    if (ret.features && Array.isArray(ret.features)) {
      ret.features = ret.features.map(f => ({
        ...f,
        image: f.image ? BASE_URL + f.image : null
      }));
    }

    return ret;
  }
});
productSchema.set("toObject", { virtuals: true });


const ProductModel = mongoose.model("updatedProduct", productSchema, "updatedProduct");
// const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
