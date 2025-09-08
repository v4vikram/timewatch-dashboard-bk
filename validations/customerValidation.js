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


// Backend validation schema for partner form
export const partnerSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.email": "Invalid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits",
      "string.empty": "Phone number is required",
      "any.required": "Phone number is required",
    }),

  pinCode: Joi.string().required().messages({
    "string.empty": "Pincode is required",
    "any.required": "Pincode is required",
  }),

  country: Joi.string().optional().allow(null, ''),  
  state: Joi.string().optional().allow(null, ''),  
  address: Joi.string().optional().allow(null, ''),  

  companyName: Joi.string().min(3).optional().allow(null, '').messages({
    "string.min": "Company name must be at least 3 characters",
  }),

  staffSize: Joi.string().optional().allow(null, ''),
  landline: Joi.string().optional().allow(null, ''),

  // gstCertificate: Joi.string().required().messages({
  //   "string.empty": "GST Certificate is required",
  //   "any.required": "GST Certificate is required",
  // }),

  // panCard: Joi.string().required().messages({
  //   "string.empty": "PAN Card is required",
  //   "any.required": "PAN Card is required",
  // }),
});


