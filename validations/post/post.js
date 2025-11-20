import Joi from "joi";

export const postValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    slug: Joi.string().min(3).max(200).required(),

    content: Joi.string().required(),
    
    excerpt: Joi.string().required(),

    featureImage: Joi.string().allow(""),

    category: Joi.string().required(),

    tags: Joi.array().items(Joi.string()).optional(),

    status: Joi.string().valid("draft", "published").default("draft"),

    author: Joi.string().optional(), // will be set via req.user._id
  });

  return schema.validate(data);
};
