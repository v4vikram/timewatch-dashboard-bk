import Joi from "joi";

export const categoryValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    slug: Joi.string().min(2).max(50).required(),
  });

  return schema.validate(data);
};
