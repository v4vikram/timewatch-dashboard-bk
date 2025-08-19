import dotenv from "dotenv";
dotenv.config();   // must be called before any process.env access

import { Storage } from "@google-cloud/storage";
import path from "path";
import slugify from "../utils/slugify.js"; // adjust path if needed
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";



const secretClient = new SecretManagerServiceClient();

// Function to initialize GCS client
async function getStorageClient() {
  let storage;

  if (process.env.NODE_ENV === "production") {
    // Load JSON credentials from Secret Manager
    const [version] = await secretClient.accessSecretVersion({
      name: process.env.GCS_KEY_SECRET, // e.g. "projects/PROJECT_ID/secrets/SECRET_NAME/versions/latest"
    });
    const credentials = JSON.parse(version.payload.data.toString());

    storage = new Storage({
      projectId: credentials.project_id,
      credentials,
    });
  } else {
    // Local dev: use JSON file
    storage = new Storage({
      projectId: process.env.GCP_PROJECT,
      keyFilename: path.join(process.cwd(), process.env.STORAGE_ACCOUNT_KEY),
    });
  }

  return storage;
}

// Save file to GCS
export async function saveUploadedFileToGCS(file, folderParts) {
  if (!file || !folderParts || !Array.isArray(folderParts)) {
    throw new Error("Valid file and folder path array are required.");
  }

  const storage = await getStorageClient();
  const bucket = storage.bucket(process.env.GCP_BUCKET);

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

  return new Promise((resolve, reject) => {
    stream.on("finish", async () => {
      try {
        // Optional: make public
        // await blob.makePublic();

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
