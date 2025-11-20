import asyncHandler from "express-async-handler";
import {
  createPostService,
  getAllPostsService,
  getPostBySlugService,
  updatePostService,
  deletePostService,
} from "../../services/post/post.js";

import { successResponse, errorResponse } from "../../utils/response.js";
import { postValidation } from "../../validations/post/post.js";

// @desc    Create Blog Post
// @route   POST /api/posts
export const createPost = asyncHandler(async (req, res) => {
  // const { error } = postValidation(req.body);
  // if (error) return errorResponse(res, 400, error.details[0].message);
  console.log(":req.body",req.body)
  return

  const post = await createPostService({
    ...req.body,
  });

  return successResponse(res, 201, "Post created successfully", post);
});

// @desc    Get All Posts
// @route   GET /api/posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await getAllPostsService();
  return successResponse(res, 200, "Posts fetched successfully", posts);
});

// @desc    Get Single Post by Slug
// @route   GET /api/posts/:slug
export const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await getPostBySlugService(req.params.slug);

  if (!post) return errorResponse(res, 404, "Post not found");

  return successResponse(res, 200, "Post fetched successfully", post);
});

// @desc    Update Post
// @route   PUT /api/posts/:id
export const updatePost = asyncHandler(async (req, res) => {
  const post = await updatePostService(req.params.id, req.body);

  if (!post) return errorResponse(res, 404, "Post not found");

  return successResponse(res, 200, "Post updated successfully", post);
});

// @desc    Delete Post
// @route   DELETE /api/posts/:id
export const deletePost = asyncHandler(async (req, res) => {
  const post = await deletePostService(req.params.id);

  if (!post) return errorResponse(res, 404, "Post not found");

  return successResponse(res, 200, "Post deleted successfully");
});
