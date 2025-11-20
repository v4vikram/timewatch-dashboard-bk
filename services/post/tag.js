import Tag from "../../models/post/Tag.js";

export const createTagService = async (data) => {
  return await Tag.create(data);
};

export const getTagsService = async () => {
  return await Tag.find();
};
