import express from "express";
import { createProduct, deleteProduct, getAllProducts,   getProductById, getAllFormatProducts,   getProductBySlug, getTrashedProducts, restoreProduct,  searchProducts,  showProductByCat,  trashProduct, updateProduct, getAllFeaturedProducts } from "../controllers/productController.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/id/:id", getProductById); 
router.get("/search", searchProducts);          // e.g., /product/id/64a...
router.get("/slug/:slug", getProductBySlug);     // e.g., /product/slug/my-product
router.get("/trashed", getTrashedProducts);
router.get("/", getAllProducts);
// productRoutes.js

// ✅ Always put specific/static routes first
router.get("/featured-products", getAllFeaturedProducts);



router.post("/create", upload.any(), createProduct);
router.put("/update/:id", upload.any(), updateProduct);
router.put("/trashed/:id", trashProduct);
router.post("/restore/:id", restoreProduct);
router.delete("/:id", deleteProduct);
router.get("/formated-product", getAllFormatProducts);
// ✅ More specific dynamic route before less specific
router.get("/:cat/:subCat", showProductByCat);

// ✅ Catch-all category last
router.get("/:cat", showProductByCat);


export default router;
