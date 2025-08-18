import { Storage } from "@google-cloud/storage";
import path from "path";
import slugify from "../utils/slugify.js"; // adjust path if needed
import dotenv from "dotenv";
dotenv.config();

// Initialize GCS client
const storage = new Storage({
  projectId: process.env.GCP_PROJECT,
   keyFilename: process.env.STORAGE_ACCOUNT_KEY,
});

// console.log("bucket", process.env.GCP_BUCKET, process.env.GCP_PROJECT)
// const bucket = storage.bucket(process.env.GCP_BUCKET);

/**
 * Save an uploaded file to Google Cloud Storage
 * @param {object} file - Multer file object (with buffer, mimetype, originalname, etc.)
 * @param {string[]} folderParts - Array of folder names inside the bucket
 * @returns {Promise<string>} - Public or signed URL of uploaded file
 */
export async function saveUploadedFileToGCS(file, folderParts) {
  console.log("file, folderParts", file, folderParts)
  if (!file || !folderParts || !Array.isArray(folderParts)) {
    throw new Error("Valid file and folder path array are required.");
  }

  const originalName = slugify(path.parse(file.originalname).name);
  const extension = path.extname(file.originalname);
  const uuid = Math.random().toString(36).substr(2, 6);

  const safeName = `${originalName}-${uuid}${extension}`;
  const destination = [...folderParts, safeName].join("/"); // e.g. products/datasheets/abc.pdf

  const blob = bucket.file(destination);
  const stream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });
  // console.log("blob", blob)

return new Promise((resolve, reject) => {
  stream.on("finish", async () => {
    try {
      // ✅ Make the file public (optional if already public)
      // await blob.makePublic();

      // Construct public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
      resolve(publicUrl);

    } catch (err) {
      reject(err);
    }
  });

  stream.on("error", (err) => reject(err));
  stream.end(file.buffer);
});

}
