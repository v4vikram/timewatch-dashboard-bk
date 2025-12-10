import asyncHandler from "express-async-handler";
import { saveUploadedFile } from "../utils/saveUploadedFile.js";
import ProductModel from "../models/ProductModel.js";
import slugify, { normalizeImageUrl } from "../utils/slugify.js";

export const createProduct = asyncHandler(async (req, res) => {
  const body = req.body;
  const files = req.files;

  const slug = slugify(body.productName, { lower: true, strict: true });

  // 🔎 Check if product already exists by name OR slug
  const existingProduct = await ProductModel.findOne({
    $or: [{ productName: body.productName }, { productSlug: slug }],
    isDeleted: false,
  });

  if (existingProduct) {
    return res.status(400).json({
      success: false,
      message: "Product already exists",
    });
  }

  const product = {
    categoryName: body.categoryName,
    subCategoryName: body.subCategoryName,
    categorySlug: slugify(body.categoryName),
    subCategorySlug: slugify(body.subCategoryName),
    productName: body.productName,
    productSlug: slug,
    description: body.description,
    datasheetFile: null,
    connectionDiagramFile: null,
    userManualFile: null,
    productkeywords: body.productkeywords,
    status: body.status,
    isFeatured: body.isFeatured || false,
    productFaq: [],
    features: [],
    table: [],
    keyFeatures: [], // ✅ added
  };

  const getFile = (field) => files.find((f) => f.fieldname === field);

  // handle file uploads
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
      "featured",
    ]);
  }

  // features
  if (Array.isArray(body.features) && body.features.length > 0) {
    for (let i = 0; i < body.features.length; i++) {
      const title = body.features[i].title;

      const imageFile = getFile(`features[${i}][image]`);
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await saveUploadedFile(imageFile, [
          "uploads",
          "features",
        ]);
      }
      if (title && imageUrl) {

        product.features.push({ title, image: imageUrl });
      }

    }
  }

  // technical table
  if (Array.isArray(body.table)) {
    for (let i = 0; i < body.table.length; i++) {
      const column1 = body.table[i].column1;
      const column2 = body.table[i].column2;

      if (column1 && column2) {

        product.table.push({ column1, column2 });
      }


    }
  }

  // FAQs
  if (Array.isArray(body.productFaq)) {
    for (let i = 0; i < body.productFaq.length; i++) {
      const column1 = body.productFaq[i].column1;
      const column2 = body.productFaq[i].column2;

      if (column1 && column2) {

        product.productFaq.push({ column1, column2 });
      }


    }
  }

  // ✅ key features (optional array of strings)
  if (Array.isArray(body.keyFeatures)) {
    product.keyFeatures = body.keyFeatures.filter(
      (feature) => feature && feature.trim() !== ""
    );
  }

  const productCreated = await ProductModel.create(product);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: productCreated,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const files = req.files || [];

  console.log("body.features", body.features)

  const existingProduct = await ProductModel.findById(id);
  if (!existingProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  const product = {
    categoryName: body.categoryName || existingProduct.categoryName,
    categorySlug:
      slugify(body.categoryName) || slugify(existingProduct.categoryName),
    subCategoryName: body.subCategoryName || existingProduct.subCategoryName,
    subCategorySlug:
      slugify(body.subCategoryName) || slugify(existingProduct.subCategoryName),
    productName: body.productName || existingProduct.productName,
    productSlug: body.productSlug || existingProduct.productSlug,
    description: body.description || existingProduct.description,
    datasheetFile: existingProduct.datasheetFile,
    connectionDiagramFile: existingProduct.connectionDiagramFile,
    userManualFile: existingProduct.userManualFile,
    productkeywords: body.productkeywords || existingProduct.productkeywords,
    status: body.status || existingProduct.status,
    isFeatured:
      body.isFeatured !== undefined
        ? body.isFeatured
        : existingProduct.isFeatured,
    features: [],
    table: [],
    productImage: existingProduct.productImage,
    keyFeatures: body.keyFeatures || existingProduct.keyFeatures || [], // ✅ added
  };

  const getFile = (field) => files.find((f) => f.fieldname === field);

  // file uploads
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
      "featured",
    ]);
  }

  // product features
  if (Array.isArray(body.features)) {
    const newFeatures = [];

    for (let i = 0; i < body.features.length; i++) {
      const title = body.features[i].title || "";
      const imageFile = getFile(`features[${i}][image]`);
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await saveUploadedFile(imageFile, [
          "uploads",
          "features",
        ]);
        console.log("if imageUrl", imageUrl)
      } else if (body.features[i].image) {
        //  console.log("else imageUrl", body.features[i].image)
        imageUrl =normalizeImageUrl(body.features[i].image);
      }

      if (title && imageUrl) {

        newFeatures.push({ title, image: imageUrl });
      }
    }

    product.features = newFeatures;
  } else {
    if (body.features == undefined) {
      product.features = []
    }
    else {

      product.features = existingProduct.features;
    }
  }

  // product table
  if (Array.isArray(body.table)) {
    product.table = body.table.map((item) => ({
      column1: item.column1,
      column2: item.column2,
    }));
  } else {
    product.table = existingProduct.table;
  }

  // FAQs
  if (Array.isArray(body.productFaq)) {
    product.productFaq = body.productFaq.map((item) => ({
      column1: item.column1,
      column2: item.column2,
    }));
  } else if (body.productFaq === undefined) {
    product.productFaq = [];
  } else {
    product.productFaq = existingProduct.productFaq;
  }

  // ✅ key features update (optional array of strings)
  if (Array.isArray(body.keyFeatures)) {
    product.keyFeatures = body.keyFeatures.filter(
      (feature) => feature && feature.trim() !== ""
    );
  } else {
    product.keyFeatures = existingProduct.keyFeatures;
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(id, product, {
    new: true,
  });

  res.json({ success: true, product: updatedProduct });
});

// Example: GET /api/products
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.find({ isDeleted: false })
    .sort({ categoryName: 1, subCategoryName: 1, display_order: 1 }).select("productName categoryName subCategoryName productImage status")
  // console.log(products)
  res.json({ success: true, count: products.length, products });
});
// export const getAllProductsForWebsite = asyncHandler(async (req, res) => {
//   const products = await ProductModel.find({ isDeleted: false })
//     .sort({ categoryName: 1, subCategoryName: 1, display_order: 1 }).select("productName productImage status")
//     console.log(products)
//   res.json({ success: true, count: products.length, products });
// });



// PUT /api/products/reorder
export const reorderProducts = asyncHandler(async (req, res) => {
  const { subCategoryName, orderedIds } = req.body;
  if (!subCategoryName || !Array.isArray(orderedIds)) {
    return res.status(400).json({ success: false, message: "subCategoryName and orderedIds are required" });
  }

  // Update each product's display_order
  for (let i = 0; i < orderedIds.length; i++) {
    await ProductModel.findByIdAndUpdate(orderedIds[i], { display_order: i });
  }

  res.json({ success: true, message: "Product order updated successfully" });
});



export const getAllFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.find({
    isDeleted: false,
    isFeatured: true,
  }).sort({ createdAt: -1 }); // latest first
  res.json({ success: true, count: products.length, products });
});



export const getAllFormatProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.aggregate([
    {
      $match: {
        isDeleted: false,
        status: "published", // only published products
      },
    },
    {
      $sort: { categoryName: 1, subCategoryName: 1, display_order: 1 },
    },
    {
      $group: {
        _id: {
          categoryName: "$categoryName",
          categorySlug: "$categorySlug",
          subCategoryName: "$subCategoryName",
          subCategorySlug: "$subCategorySlug",
        },
        products: {
          $push: {
            productName: "$productName",
            productSlug: "$productSlug",
          },
        },
      },
    },
    {
      $group: {
        _id: {
          categoryName: "$_id.categoryName",
          categorySlug: "$_id.categorySlug",
        },
        subCategories: {
          $push: {
            subCategoryName: "$_id.subCategoryName",
            subCategorySlug: "$_id.subCategorySlug",
            products: "$products",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        categoryName: "$_id.categoryName",
        categorySlug: "$_id.categorySlug",
        subCategories: 1,
      },
    },
  ]);

  res.json({ success: true, count: products.length, products });
});



export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id)

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.json({ success: true, product });
});
export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await ProductModel.findOne({ productSlug: slug, isDeleted: false });
  console.log("products",)

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

// 🔎 Search products by name or keywords
export const searchProducts = asyncHandler(async (req, res) => {
  const { title } = req.query; // ?q=attendance

  let q = title;

  if (!q) {
    return res.status(400).json({ message: "Search query (q) is required" });
  }

  // normalize the query
  const normalizedQuery = q.toLowerCase().replace(/[^a-z0-9]/g, "");
  // console.log("normalizedQuery", normalizedQuery)

  const products = await ProductModel.find({
    isDeleted: false,
    status: "published",
    $or: [
      { productName: { $regex: q, $options: "i" } }, // normal search
      { productName: { $regex: normalizedQuery, $options: "i" } }, // normalized match
      { productkeywords: { $regex: q, $options: "i" } }, // keyword search
    ],
  }).select(
    "productName categoryName subCategoryName productSlug status productImage"
  );

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

export const showProductByCat = asyncHandler(async (req, res) => {
  const { cat, subCat } = req.params;


  let filter = {
    status: "published",
    isDeleted: false,
  };

  // ✅ Apply filters only if params exist
  if (cat) {
    filter.categorySlug = cat.toLowerCase();
  }
  if (subCat && subCat != "subCat") {
    filter.subCategorySlug = subCat.toLowerCase();
  }

  const products = await ProductModel.find(filter);

  if (!products.length) {
    return res.status(404).json({ message: "No products found" });
  }

  res.status(200).json(products);
});

export const getCategorySubcatsWithOneProduct = asyncHandler(async (req, res) => {
  const { categorySlug } = req.params;

  if (!categorySlug) {
    return res.status(400).json({
      success: false,
      message: "Category slug is required",
    });
  }

  // 1️⃣ Get all unique subcategories under this category
  const subCategories = await ProductModel.aggregate([
    {
      $match: {
        categorySlug,
        isDeleted: false,

      }
    },
    {
      $group: {
        _id: "$subCategorySlug",
        subCategoryName: { $first: "$subCategoryName" }
      }
    },
    {
      $project: {
        _id: 0,
        subCategorySlug: "$_id",
        subCategoryName: 1
      }
    }
  ]);

  // 2️⃣ For each subcategory → fetch ONLY required fields
  const results = await Promise.all(
    subCategories.map(async (subcat) => {
      const product = await ProductModel.findOne(
        {
          isDeleted: false,
          categorySlug,
          status: "published",
          subCategorySlug: subcat.subCategorySlug
        },
        {
          // 🎯 ONLY return these fields
          productName: 1,
          productSlug: 1,
          productImage: 1,
          description: 1,
          categorySlug: 1,
          subCategorySlug: 1,
          status: 1,
        }
      )
        .sort({ display_order: 1, createdAt: -1 })
        .lean();

      return {
        subCategorySlug: subcat.subCategorySlug,
        subCategoryName: subcat.subCategoryName,
        product
      };
    })
  );

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});




