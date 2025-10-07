import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    status: String,
    categoryName: String,
    categorySlug: String,       // ✅ new field
    subCategoryName: String,
    subCategorySlug: String,    // ✅ new field
    productName: String,
    productSlug: String,
    description: String,
    datasheetFile: String,
    connectionDiagramFile: String,
    userManualFile: String,
    productImage: String,
    productkeywords: String,
    isFeatured: Boolean,
    productFaq: [
        {
            column1: String,
            column2: String,
        },
    ],
    features: [
        {
            title: String,
            image: String,
        },
    ],
    table: [
        {
            column1: String,
            column2: String,
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });



const  ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
