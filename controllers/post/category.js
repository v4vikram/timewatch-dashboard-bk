import asyncHandler from "express-async-handler";
import {
  createCategoryService,
  getCategoriesService,
} from "../../services/post/category.js";

import { successResponse, errorResponse } from "../../utils/response.js";
import { categoryValidation } from "../../validations/post/category.js";

// @desc    Create Category
// @route   POST /api/categories
export const createCategory = asyncHandler(async (req, res) => {
  const { error } = categoryValidation(req.body);
  if (error) return errorResponse(res, 400, error.details[0].message);

  const category = await createCategoryService(req.body);
  return successResponse(res, 201, "Category created", category);
});

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await getCategoriesService();
  return successResponse(res, 200, "Categories fetched", categories);
});
