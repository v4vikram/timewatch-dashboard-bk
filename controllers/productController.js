import asyncHandler from "express-async-handler";
import { saveUploadedFile } from "../utils/saveUploadedFile.js";
import ProductModel from "../models/ProductModel.js";
import slugify from "../utils/slugify.js";

export const createProduct = asyncHandler(async (req, res) => {
  const body = req.body;
  const files = req.files;

  const product = {
    categoryName: body.categoryName,
    subCategoryName: body.subCategoryName,
    productName: body.productName,
    productSlug: slugify(body.productName),
    description: body.description,
    datasheetFile: null,
    connectionDiagramFile: null,
    userManualFile: null,
    productkeywords: body.productkeywords,
    status: body.status,
    features: [],
    table: [],
  };

  const getFile = (field) => files.find((f) => f.fieldname === field);

  const datasheetFile = getFile("datasheetFile");
  if (datasheetFile) {
    product.datasheetFile = await saveUploadedFile(datasheetFile, [
      "uploads",
      "docs",
      "datasheet",
    ]);
  }

  const userManualFile = getFile("userManualFile");
  if (userManualFile) {
    product.userManualFile = await saveUploadedFile(userManualFile, [
      "uploads",
      "docs",
      "user-manual",
    ]);
  }

  const connectionDiagramFile = getFile("connectionDiagramFile");
  if (connectionDiagramFile) {
    product.connectionDiagramFile = await saveUploadedFile(
      connectionDiagramFile,
      ["uploads", "docs", "diagram"]
    );
  }

  const productImage = getFile("productImage");
  if (productImage) {
    product.productImage = await saveUploadedFile(productImage, [
      "uploads",
      "products",
    ]);
  }

  if (Array.isArray(body.features)) {
    for (let i = 0; i < body.features.length; i++) {
      const title = body.features[i].title;
      const imageFile = getFile(`features[${i}][image]`);
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await saveUploadedFile(imageFile, ["uploads", "features"]);
      }

      product.features.push({ title, image: imageUrl });
    }
  }

  if (Array.isArray(body.table)) {
    for (let i = 0; i < body.table.length; i++) {
      const column1 = body.table[i].column1;
      const column2 = body.table[i].column2;

      product.table.push({ column1, column2 });
    }
  }

  // return
  const productCreated = await ProductModel.create(product);
  res.json({ success: true, product: productCreated });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const files = req.files || [];
  console.log("files=>", files);

  // Find existing product
  const existingProduct = await ProductModel.findById(id);
  if (!existingProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // Prepare update object (default to existing values)
  const product = {
    categoryName: body.categoryName || existingProduct.categoryName,
    subCategoryName: body.subCategoryName || existingProduct.subCategoryName,
    productName: body.productName || existingProduct.productName,
    productSlug: body.productSlug || existingProduct.productSlug,
    description: body.description || existingProduct.description,
    datasheetFile: existingProduct.datasheetFile,
    connectionDiagramFile: existingProduct.connectionDiagramFile,
    userManualFile: existingProduct.userManualFile,
    productkeywords: body.productkeywords || existingProduct.productkeywords,
    status: body.status || existingProduct.status,
    features: [],
    table: [],
    productImage: existingProduct.productImage,
  };

  const getFile = (field) => files.find((f) => f.fieldname === field);

  // Save new files if provided
  const datasheetFile = getFile("datasheetFile");
  if (datasheetFile) {
    product.datasheetFile = await saveUploadedFile(datasheetFile, [
      "uploads",
      "docs",
      "datasheet",
    ]);
  }

  const userManualFile = getFile("userManualFile");
  if (userManualFile) {
    product.userManualFile = await saveUploadedFile(userManualFile, [
      "uploads",
      "docs",
      "user-manual",
    ]);
  }

  const connectionDiagramFile = getFile("connectionDiagramFile");
  if (connectionDiagramFile) {
    product.connectionDiagramFile = await saveUploadedFile(
      connectionDiagramFile,
      ["uploads", "docs", "diagram"]
    );
  }

  const productImage = getFile("productImage");
  if (productImage) {
    product.productImage = await saveUploadedFile(productImage, [
      "uploads",
      "products",
    ]);
  }

  // Handle features[] (replace if provided)





  if (product.features.length === 0) {
    product.features = existingProduct.features; // Keep old features if none provided
  }

    if (Array.isArray(body.features)) {
    for (let i = 0; i < body.features.length; i++) {
      const title = body.features[i].title;
      const imageFile = getFile(`features[${i}][image]`);
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await saveUploadedFile(imageFile, ["uploads", "features"]);
      }

      product.features.push({ title, image: imageUrl });
    }
  }

  if (product.table.length === 0) {
    product.table = existingProduct.table; // Keep old table if none provided
  }

  
  if (Array.isArray(body.table)) {
    for (let i = 0; i < body.table.length; i++) {
      const column1 = body.table[i].column1;
      const column2 = body.table[i].column2;

      product.table.push({ column1, column2 });
    }
  }
  // Update product in DB
  const updatedProduct = await ProductModel.findByIdAndUpdate(id, product, {
    new: true,
  });

  res.json({ success: true, product: updatedProduct });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.find({isDeleted: false}).sort({ createdAt: -1 }); // latest first
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
export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await ProductModel.findOne({productSlug: slug });

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
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
