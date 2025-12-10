import path from "path";
import fs from "fs";
import slugify from "../utils/slugify.js";

// Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Save uploaded file using Multer (local disk)
 * Replaces saveUploadedFileToGCS()
 */
export async function saveUploadedFile(file, folderParts) {
  if (!file || !Array.isArray(folderParts)) {
    throw new Error("Valid file and folderParts array required");
  }

  // Folder inside /uploads
  const uploadDir = path.join(process.cwd(), "uploads", ...folderParts);
  ensureDir(uploadDir);

  // Create safe unique filename
  const name = slugify(path.parse(file.originalname).name);
  const ext = path.extname(file.originalname);
  const unique = Math.random().toString(36).substring(2, 8);
  const filename = `${name}-${unique}${ext}`;

  // Full path
  const fullPath = path.join(uploadDir, filename);

  // Write file buffer to disk
  fs.writeFileSync(fullPath, file.buffer);

  // Return public URL (served by Express or Nginx)
  return `/uploads/${folderParts.join("/")}/${filename}`;
}
