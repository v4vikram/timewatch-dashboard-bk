import asyncHandler from "express-async-handler";
import Media from "../../models/media/media.js";
import { saveUploadedFileToGCS } from "../../services/upload.gcs.service.js";

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const uploaded = await saveUploadedFileToGCS(req.file, ["uploads", "media"]);

  const media = await Media.create({
    filename: req.file.originalname,
    url: uploaded,
    path: "uploads/media",
    type: req.file.mimetype,
    size: req.file.size,
  });

  res.status(201).json({ success: true, media });
});

export const getMedia = asyncHandler(async (req, res) => {
  const files = await Media.find().sort({ createdAt: -1 });
  res.json({ success: true, files });
});

