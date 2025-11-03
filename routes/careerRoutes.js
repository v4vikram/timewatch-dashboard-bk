import express from "express";
import multer from "multer";
import path from "path";
import { createCareer, getAllCareers } from "../controllers/careerController.js";

const router = express.Router();

// Multer setup for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getAllCareers);
router.post("/", upload.single("resume"), createCareer);

export default router;
