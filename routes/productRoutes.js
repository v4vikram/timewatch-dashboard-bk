import express from "express";
import multer from "multer";
import { createProduct, deleteProduct, getAllProducts,   getProductById,   getProductBySlug, getTrashedProducts, restoreProduct, trashProduct, updateProduct } from "../controllers/productController.js";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/id/:id", getProductById);           // e.g., /product/id/64a...
router.get("/slug/:slug", getProductBySlug);     // e.g., /product/slug/my-product
router.get("/trashed", getTrashedProducts);
router.get("/", getAllProducts);
router.post("/create", upload.any(), createProduct);
router.put("/update/:id", upload.any(), updateProduct);
router.put("/trashed/:id", trashProduct);
router.post("/restore/:id", restoreProduct);
router.delete("/:id", deleteProduct);

export default router;
