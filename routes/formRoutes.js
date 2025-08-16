import express from "express";
import { homePageForm } from "../controllers/formController.js";
import Joi from "joi";

const router = express.Router();

// ✅ Define schema
const customerSchema = Joi.object({
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
        .pattern(/^\+?[0-9\s]{1,15}$/) // + optional, digits and spaces, 1–15 chars
        .required()
        .messages({
            'string.empty': 'Phone number is required',
            'any.required': 'Phone number is required',
            'string.pattern.base': 'Phone must be up to 15 digits',
        })

    ,

    email: Joi.string()
        .email()
        .optional()
        .required()
        .messages({
            'any.required': 'Email number is required',
            'string.email': 'Email must be a valid email address',
        }),

    location: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Location must be at least {#limit} characters',
            'string.max': 'Location must not exceed {#limit} characters',
        }),

    message: Joi.string()
        .trim()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Message must not exceed {#limit} characters',
        }),
});

// ✅ Validation middleware
function validateCustomer(req, res, next) {
    const { error, value } = customerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            errors: error.details.map(err => err.message),
        });
    }

    req.body = value; // sanitized data
    next();
}

// ✅ Apply middleware before controller
router.post('/customer', validateCustomer, homePageForm);

export default router;
