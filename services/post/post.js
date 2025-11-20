
import Post from "../../models/post/Post.js";
import { saveUploadedFileToGCS } from "../../services/upload.gcs.service.js";

export const createPostService = async (req) => {

  const body = req.body;
  const files = req.files;

  // find the featured image file
  const featureImageFile = files.find(
    (file) => file.fieldname === "featureImage"
  );



  if (featureImageFile) {
    featureImageUrl = await saveUploadedFileToGCS(featureImageFile, [
      "uploads",
      "blogs",
      "featured",
    ]);
  }
 

  return await Post.create({
    ...body,
    featureImageUrl: featureImageUrl,
  });
};


export const getAllPostsService = async (filters = {}) => {
  return await Post.find(filters)
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .populate("author", "name email");
};

export const getPostBySlugService = async (slug) => {
  return await Post.findOne({ slug })
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .populate("author", "name email");
};

export const updatePostService = async (id, data) => {
  return await Post.findByIdAndUpdate(id, data, { new: true });
};

export const deletePostService = async (id) => {
  return await Post.findByIdAndDelete(id);
};
