import path from "path";
import { writeFile, mkdir } from "fs/promises";
import slugify from "./slugify.js"; // adjust path if needed

export async function saveUploadedFile(file, folderParts) {
  if (!file || !folderParts || !Array.isArray(folderParts)) {
    throw new Error("Valid file and folder path array are required.");
  }

  const originalName = slugify(path.parse(file.originalname).name);
  const extension = path.extname(file.originalname);
  const uuid = Math.random().toString(36).substr(2, 6);

  const safeName = `${originalName}-${uuid}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", ...folderParts);
  const filePath = path.join(uploadDir, safeName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, file.buffer);
  // console.log("file.originalname", path.join(...folderParts, safeName).replace(/\\/g, "/"))

  return `${path.join(...folderParts, safeName).replace(/\\/g, "/")}`;
}
