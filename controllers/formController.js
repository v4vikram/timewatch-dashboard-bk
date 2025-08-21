import asyncHandler from "express-async-handler";
import { Customer, Partner } from "../models/FormModel.js";
import { sendEmailToCompany, sendMessageToCustomer } from "../services/email.service.js";
import { generateEmailHTML } from "../utils/emailTemplate.js";
import { saveUploadedFileToGCS } from "../services/upload.gcs.service.js";

// Customer Form
export const homePageForm = asyncHandler(async (req, res) => {
  const formEntry = new Customer(req.body);
  await formEntry.save();

  sendEmailToCompany({
    to: ["v4vikram.dev@gmail.com"],
    subject: "New Customer Form Submission",
    html: generateEmailHTML(req.body, "New Customer Form Submission"),
  });

  sendMessageToCustomer(req.body);

  res.status(201).json({
    success: true,
    message: "Customer form submitted successfully",
    data: formEntry,
  });
});

// Partner Form
export const partnerPageForm = asyncHandler(async (req, res) => {
  console.log("Partner req.body", req.body);
  console.log("Partner files", req.files);

  const formEntry = new Partner(req.body);

  const getFile = (field) => req.files.find((f) => f.fieldname === field);

  const gstCertificate = getFile("gstCertificate");
  const panCard = getFile("panCard");

  // Upload files to cloud + attach to entry
  if (gstCertificate) {
    formEntry.gstCertificate = await saveUploadedFileToGCS(gstCertificate, [
      "uploads",
      "partner",
      "gst",
    ]);
  }
  if (panCard) {
    formEntry.panCard = await saveUploadedFileToGCS(panCard, [
      "uploads",
      "partner",
      "pancard",
    ]);
  }

  // Save to DB AFTER uploads succeed
  await formEntry.save();

  // Send email
  sendEmailToCompany({
    to: ["v4vikram.dev@gmail.com"],
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

