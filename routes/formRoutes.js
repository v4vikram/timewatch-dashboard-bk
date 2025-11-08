import express from "express";
import { createCareer, deleteCustomerById, getAllCareers, getAllCustomers, getAllPartners, homePageForm, partnerPageForm, updatedCustomer } from "../controllers/formController.js";
import { validate } from "../middlewares/validateMiddleware.js"
import { customerSchema, partnerSchema } from "../validations/customerValidation.js"

import multer from "multer";
import { landingPopupForm } from "../controllers/landingPopupController.js";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();


router.post('/customer', validate(customerSchema), homePageForm);
router.get('/customers', getAllCustomers);
router.put('/customers/:id', updatedCustomer);
router.delete('/customer/delete/:id', deleteCustomerById);
router.get('/partners', getAllPartners);
router.post('/partner', upload.any(), validate(partnerSchema), partnerPageForm);
router.post('/career', upload.any(),  createCareer);
router.get('/career', getAllCareers);
router.post("/landing-popup", landingPopupForm);

export default router;
