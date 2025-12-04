import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    metaTitle: String,
    jsonLd: String,
    // NEW FIELDS — summary for listing pages / cards
    summaryTitle: String,
    summaryDescription: String,
    slug: {
        type: String,
        unique: true
    },
     faq: [
        { column1: String, column2: String }
    ],
    description: String, //using for seo
    featuredImage: String,
    mainCategory: String,
    subCategory: String,
    keywords: String,
    isFeatured: Boolean,
    status: String,
   
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });



const BlogModel = mongoose.model("Blog", blogSchema);
export default BlogModel;
