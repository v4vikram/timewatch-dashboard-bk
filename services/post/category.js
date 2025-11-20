import Category from "../../models/post/Category.js";

export const createCategoryService = async (data) => {
  return await Category.create(data);
};

export const getCategoriesService = async () => {
  return await Category.find();
};
