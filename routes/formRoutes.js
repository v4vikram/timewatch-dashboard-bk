import express from "express";
import { homePageForm, partnerPageForm } from "../controllers/formController.js";
import { validate } from "../middlewares/validateMiddleware.js"
import { customerSchema, partnerSchema } from "../validations/customerValidation.js"

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();


router.post('/customer', validate(customerSchema), homePageForm);
router.post('/partner', upload.any(), validate(partnerSchema), partnerPageForm);

export default router;
