import express from "express";
import { homePageForm, partnerPageForm } from "../controllers/formController.js";
import { validate } from "../middlewares/validateMiddleware.js"
import { customerSchema } from "../validations/customerValidation.js"

const router = express.Router();


router.post('/customer', validate(customerSchema), homePageForm);
router.post('/partner',  partnerPageForm);

export default router;
