import asyncHandler from "express-async-handler";
import { saveUploadedFileToGCS } from "../services/upload.gcs.service.js";
import BlogModel from "../models/BlogModel.js";
import ProductModel from "../models/ProductModel.js";
import slugify from "../utils/slugify.js";

export const createBlog = asyncHandler(async (req, res) => {
  const body = req.body;
  const files = req.files || [];

  // Check existing title or slug
  const slug = body.slug || slugify(body.title, { lower: true, strict: true });

  const exists = await BlogModel.findOne({ slug, isDeleted: false });
  const titleExists = await BlogModel.findOne({ title: body.title, isDeleted: false });

  if (exists) {
    return res.status(400).json({ success: false, message: "Slug already exists" });
  }
  if (titleExists) {
    return res.status(400).json({ success: false, message: "Title already exists" });
  }

  // Helper to get file
  const getFile = (field) => files.find((f) => f.fieldname === field);

  /** -------------------------
   *  FEATURED IMAGE UPLOAD
   --------------------------*/
  let featuredImage = null;
  const featuredImgFile = getFile("featuredImage");

  if (featuredImgFile) {
    featuredImage = await saveUploadedFileToGCS(featuredImgFile, [
      "uploads",
      "blogs",
      "featured",
    ]);
  }

  /** -------------------------
   *  BUILD BLOG OBJECT
   --------------------------*/
  const blogData = {
    title: body.title,
    slug: slug,
    summaryTitle: body.summaryTitle || "",
    summaryDescription: body.summaryDescription || "",
    content: body.content,
    featuredImage,
    description: body.description, // SEO description
    metaTitle: body.metaTitle,
    jsonLd: body.jsonLd,
    keywords: body.keywords,
    mainCategory: body.mainCategory,
    subCategory: body.subCategory,
    status: body.status,
    faq: [],
  };

  /** -------------------------
   *  HANDLE FAQ ARRAY
   --------------------------*/
  if (Array.isArray(body.faq)) {
    blogData.faq = body.faq
      .filter((row) => row.column1 && row.column2)
      .map((row) => ({
        column1: row.column1,
        column2: row.column2,
      }));
  }

  /** -------------------------
   *  CREATE BLOG
   --------------------------*/
  const created = await BlogModel.create(blogData);

  return res.status(201).json({
    success: true,
    blog: created,
  });
});



export const blogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  let blog = await BlogModel.findOne({ slug }).lean();


  if (!blog) {
    return res.status(404).json({ success: false, message: "blog not found" });
  }
  blog.mainCategorySlug = slugify(blog.mainCategory);
  res.json({ success: true, blog });
});

export const getAllBlog = asyncHandler(async (req, res) => {
  const { status } = req.query;
  console.log("status", status)

  let filter = {};

  // Only filter when ?status=published is provided
  if (status === "published") {
    filter.status = "published";
  }

  const blogs = await BlogModel.find(filter).sort({ createdAt: -1 });

  res.json({ success: true, blogs });
});


export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const files = req.files || [];

  // Ensure blog exists
  const existingBlog = await BlogModel.findById(id);
  if (!existingBlog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  /** ------------------------------------
   *   Duplicate Title Check
   * ------------------------------------ */
  if (body.title) {
    const titleExist = await BlogModel.findOne({
      title: body.title,
      _id: { $ne: id },
    });

    if (titleExist) {
      return res.status(400).json({
        success: false,
        message: "Title already exists",
      });
    }
  }

  /** ------------------------------------
   *   Duplicate Slug Check
   * ------------------------------------ */
  if (body.slug) {
    const slugExist = await BlogModel.findOne({
      slug: body.slug,
      _id: { $ne: id },
    });

    if (slugExist) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }
  }

  /** Auto-generate slug if title changed */
  if (body.title && !body.slug) {
    body.slug = slugify(body.title, { lower: true });
  }

  /** ------------------------------------
   *   Handle Featured Image Upload
   * ------------------------------------ */
  const getFile = (field) => files.find((f) => f.fieldname === field);
  const featuredImageFile = getFile("featuredImage");


  let featuredImage = existingBlog.featuredImage;

  if (featuredImageFile) {
    featuredImage = await saveUploadedFileToGCS(featuredImageFile, [
      "uploads",
      "blogs",
      "featured",
    ]);
  }
  console.log(":featuredImage", featuredImage)

  /** ------------------------------------
   *   Handle FAQ
   * ------------------------------------ */
  let faq = existingBlog.faq;

  if (Array.isArray(body.faq)) {
    faq = body.faq
      .filter((row) => row.column1 && row.column2)
      .map((row) => ({
        column1: row.column1,
        column2: row.column2,
      }));
  }

  /** ------------------------------------
   *   Build Updated Fields Object
   * ------------------------------------ */
  const updatedFields = {
    title: body.title ?? existingBlog.title,
    slug: body.slug ?? existingBlog.slug,
    content: body.content ?? existingBlog.content,
    description: body.description ?? existingBlog.description,
    status: body.status ?? existingBlog.status,
    keywords: body.keywords ?? existingBlog.keywords,
    metaTitle: body.metaTitle ?? existingBlog.metaTitle,
    jsonLd: body.jsonLd ?? existingBlog.jsonLd,
    mainCategory: body.mainCategory ?? existingBlog.mainCategory,
    subCategory: body.subCategory ?? existingBlog.subCategory,

    // NEW FIELDS
    summaryTitle: body.summaryTitle ?? existingBlog.summaryTitle,
    summaryDescription: body.summaryDescription ?? existingBlog.summaryDescription,

    // image + faq
    featuredImage,
    faq,
  };

  /** ------------------------------------
   *   Update Blog
   * ------------------------------------ */
  const updatedBlog = await BlogModel.findByIdAndUpdate(id, updatedFields, {
    new: true,
  });

  return res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    blog: updatedBlog,
  });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await BlogModel.findById(id);
  if (!blog) {
    return res
      .status(404)
      .json({ success: false, message: "Blog not found" });
  }

  await blog.deleteOne();

  res.json({ success: true, message: "Blog deleted successfully" });
});




export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.find({ isDeleted: false }).sort({ createdAt: -1 }); // latest first
  res.json({ success: true, count: products.length, products });
});
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.json({ success: true, product });
});




export const trashProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.json({ success: true, message: "Product moved to trash", product });
});

export const restoreProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  product.isDeleted = false;
  product.deletedAt = null;
  await product.save();

  res.json({
    success: true,
    message: "Product restored successfully",
    product,
  });
});
export const getTrashedProducts = asyncHandler(async (req, res) => {
  const trashedProducts = await ProductModel.find({ isDeleted: true }).sort({
    deletedAt: -1,
  });

  res.status(200).json({
    success: true,
    products: trashedProducts,
  });
});
