import asyncHandler from "express-async-handler";
import { Customer, Partner } from "../models/FormModel.js";
import { sendEmailToCompany, sendMessageToCustomer } from "../services/email.service.js";
import { generateEmailHTML } from "../utils/emailTemplate.js";

// Customer Form
export const homePageForm = asyncHandler(async (req, res) => {
  const formEntry = new Customer(req.body);
  await formEntry.save();

  // Send email
  sendEmailToCompany({
    subject: "New Customer Form Submission",
    html: generateEmailHTML(req.body, "New Customer Form Submission"),
  });

  // Send message
  sendMessageToCustomer(req.body);

  res.status(201).json({
    success: true,
    message: "Customer form submitted successfully",
    data: formEntry,
  });
});

// Partner Form
export const partnerPageForm = asyncHandler(async (req, res) => {


  const formEntry = new Partner(req.body);
  // console.log("Partner req.body", req.body)
  await formEntry.save();

  // Send email
  sendEmailToCompany({
    subject: "New Partner Form Submission",
    html: generateEmailHTML(req.body, "New Partner Form Submission"),
  });

  // Send message
  sendMessageToCustomer(req.body);

  res.status(201).json({
    success: true,
    message: "Partner form submitted successfully",
    data: formEntry,
  });
});
