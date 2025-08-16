import asyncHandler from "express-async-handler";
import { saveUploadedFile } from "../utils/saveUploadedFile.js";
import BlogModel from "../models/BlogModel.js";
import slugify from "../utils/slugify.js";

export const createBlog = asyncHandler(async (req, res) => {
  const body = req.body;
  const files = req.files;

  const exists = await BlogModel.findOne({ slug: body.slug });
  const titleExist = await BlogModel.findOne({ title: body.title });

  if (exists) {
    return res.status(400).json({ success: false, message: "Slug already exists" });
  }
  if (titleExist) {
    return res.status(400).json({ success: false, message: "Title already exists" });
  }

  if (files && files[0]?.originalname) {
    body.featuredImage = await saveUploadedFile(files[0], [
      "uploads",
      "blogs",
      "featuredImage"
    ]);
  }

  if (body.title && !body.slug) {
    body.slug = slugify(body.title);
  }

  const Created = await BlogModel.create(body);
  res.status(201).json({ success: true, blog: Created });
});

export const blogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const blog = await BlogModel.findOne({ slug });

  if (!blog) {
    return res.status(404).json({ success: false, message: "blog not found" });
  }

  res.json({ success: true, blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const body = req.body;
  const files = req.files;

  const exists = await BlogModel.findOne({ slug: body.slug });
  const titleExist = await BlogModel.findOne({ title: body.title });

  if (exists) {
    return res.status(400).json({ success: false, message: "Slug already exists" });
  }
  if (titleExist) {
    return res.status(400).json({ success: false, message: "Title already exists" });
  }

  if (files && files[0]?.originalname) {
    body.featuredImage = await saveUploadedFile(files[0], [
      "uploads",
      "blogs",
      "featuredImage"
    ]);
  }

  if (body.title && !body.slug) {
    body.slug = slugify(body.title);
  }

  const Created = await BlogModel.create(body);
  res.status(201).json({ success: true, blog: Created });
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



export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  await product.deleteOne();

  res.json({ success: true, message: "Product deleted successfully" });
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
