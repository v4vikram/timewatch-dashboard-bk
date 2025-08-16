import asyncHandler from "express-async-handler";
import {FormModel} from "../models/FormModel.js";
import slugify from "../utils/slugify.js";

export const homePageForm = asyncHandler(async (req, res) => {

  console.log("req", req.body)




  // return
//   const productCreated = await ProductModel.create(product);
//   res.json({ success: true, product: productCreated });
});