import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: String,
    slug:{
        type:String,
        unique:true
    },
    description: String,
    featuredImage:String,
    category: String,
    subCategory: String,
    keywords: String,
    isFeatured: Boolean,
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });



const  BlogModel = mongoose.model("Blog", blogSchema);
export default BlogModel;
