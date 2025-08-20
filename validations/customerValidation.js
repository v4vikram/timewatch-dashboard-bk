import Joi from "joi";

export const customerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required',
            'string.min': 'Name must be at least {#limit} characters',
            'string.max': 'Name must not exceed {#limit} characters',
        }),

    phone: Joi.string()
        .pattern(/^\+?[0-9\s]{1,15}$/)
        .required()
        .messages({
            'string.empty': 'Phone is required',
            'any.required': 'Phone is required',
            'string.pattern.base': 'Phone must be up to 15 digits',
        }),

    email: Joi.string()
        .email()
        .trim()
        .required()
        .empty('') // if empty string comes, treat as missing → trigger required
        .messages({
            'string.empty': 'Email is required',
            'any.required': 'Email is required',
            'string.email': 'Email must be a valid email address',
        }),

    location: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional()
        .empty('') // ✅ empty string allowed → treated as undefined
        .messages({
            'string.min': 'Location must be at least {#limit} characters',
            'string.max': 'Location must not exceed {#limit} characters',
        }),

    message: Joi.string()
        .trim()
        .max(500)
        .optional()
        .empty('') // ✅ same here
        .messages({
            'string.max': 'Message must not exceed {#limit} characters',
        }),
});
