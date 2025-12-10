import { Storage } from "@google-cloud/storage";
import path from "path";
import slugify from "./slugify.js";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT,
});

const bucket = storage.bucket(process.env.GCS_BUCKET);

export async function saveUploadedFile(file, folderParts) {
  const originalName = slugify(path.parse(file.originalname).name);
  const extension = path.extname(file.originalname);
  const uuid = Math.random().toString(36).substr(2, 6);

  const safeName = `${originalName}-${uuid}${extension}`;
  const destination = [...folderParts, safeName].join("/");

  const blob = bucket.file(destination);
  const stream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    stream.on("finish", async () => {
      // Option A: public file
      // await blob.makePublic();
      // resolve(`https://storage.googleapis.com/${bucket.name}/${destination}`);

      // Option B: signed URL (expires in 7 days)
      const [url] = await blob.getSignedUrl({
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });
      resolve(url);
    });

    stream.on("error", (err) => reject(err));
    stream.end(file.buffer);
  });
}
