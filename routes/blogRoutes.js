import express from "express";
import multer from "multer";
import { createBlog, deleteProduct, getAllProducts,   getProductById,   blogBySlug, getTrashedProducts, restoreProduct, trashProduct, updateBlog } from "../controllers/blogController.js";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/id/:id", getProductById);           // e.g., /product/id/64a...
router.get("/slug/:slug", blogBySlug);     // e.g., /product/slug/my-product
router.get("/trashed", getTrashedProducts);
router.get("/", getAllProducts);
router.post("/create", upload.any(), createBlog);
router.put("/update/:id", upload.any(), updateBlog);
router.put("/trashed/:id", trashProduct);
router.post("/restore/:id", restoreProduct);
router.delete("/:id", deleteProduct);

export default router;
