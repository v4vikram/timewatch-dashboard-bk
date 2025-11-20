import asyncHandler from "express-async-handler";
import {
  createTagService,
  getTagsService,
} from "../../services/post/tag.js"

import { successResponse, errorResponse } from "../../utils/response.js";
import { tagValidation } from "../../validations/post/tag.js";

// @desc    Create Tag
// @route   POST /api/tags
export const createTag = asyncHandler(async (req, res) => {
  const { error } = tagValidation(req.body);
  if (error) return errorResponse(res, 400, error.details[0].message);

  const tag = await createTagService(req.body);
  return successResponse(res, 201, "Tag created", tag);
});

// @desc    Get all tags
// @route   GET /api/tags
export const getTags = asyncHandler(async (req, res) => {
  const tags = await getTagsService();
  return successResponse(res, 200, "Tags fetched", tags);
});
