import asyncHandler from "express-async-handler";
import { Customer, Partner } from "../models/FormModel.js";
import { sendEmailToCompany, sendMessageToCustomer } from "../services/email.service.js";
import { generateEmailHTML } from "../utils/emailTemplate.js";
import { saveUploadedFileToGCS } from "../services/upload.gcs.service.js";
import { Career } from "../models/Career.js";

// Customer Form
export const homePageForm = asyncHandler(async (req, res) => {
  const formEntry = new Customer({
    ...req.body,
    flag: true,
  });
  await formEntry.save();

  sendEmailToCompany({
    to: ["v4vikram.dev@gmail.com", "sales@timewatchindia.com", "marketing@timewatchindia.com"],
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

export const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  res.json({ success: true, count: customers.length, customers });
});



// Delete customer by ID
export const deleteCustomerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const customer = await Customer.findById(id);

  if (!customer) {
    return res.status(404).json({ success: false, message: "Customer not found" });
  }

  await customer.deleteOne();

  res.json({
    success: true,
    message: "Customer deleted successfully",
    id,
  });
});

export const updatedCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, location, message, type } = req.body;

  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name,
      email,
      phone,
      location,
      message,
      type,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!updatedCustomer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  res.status(200).json({
    message: "Customer updated successfully",
    customer: updatedCustomer,
  });
});




// Partner Form
export const partnerPageForm = asyncHandler(async (req, res) => {
  // Check uploaded files
  const getFile = (field) => req.files?.find((f) => f.fieldname === field);

  const gstCertificate = getFile("gstCertificate");
  const panCard = getFile("panCard");

  if (!gstCertificate) {
    return res.status(400).json({ errors: { gstCertificate: "GST Certificate is required" } });
  }
  if (!panCard) {
    return res.status(400).json({ errors: { panCard: "PAN Card is required" } });
  }

  // Create Partner entry with validated req.body
  const formEntry = new Partner(req.body);

  // Upload files and attach to entry
  formEntry.gstCertificate = await saveUploadedFileToGCS(gstCertificate, [
    "uploads",
    "partner",
    "gst",
  ]);
  formEntry.panCard = await saveUploadedFileToGCS(panCard, [
    "uploads",
    "partner",
    "pancard",
  ]);

  await formEntry.save();

  // Notifications
  await sendEmailToCompany({
    to: ["v4vikram.dev@gmail.com", "hr@timewatchindia.com"],
    subject: "New Partner Form Submission",
    html: generateEmailHTML(req.body, "New Partner Form Submission"),
  });

  await sendMessageToCustomer(req.body);

  res.status(201).json({
    success: true,
    message: "Partner form submitted successfully",
    data: formEntry,
  });
});

// Get All Partners
export const getAllPartners = asyncHandler(async (req, res) => {
  const partners = await Partner.find().sort({ createdAt: -1 });

  if (!partners || partners.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No partner entries found",
    });
  }

  res.status(200).json({
    success: true,
    count: partners.length,
    data: partners,
  });
});







export const createCareer = asyncHandler(async (req, res) => {
  const { roleApplyingFor, fullName, contactNumber, emailAddress, location, coverLetter } = req.body;
  const files = req.files || [];

  // helper
  const getFile = (field) => files.find((f) => f.fieldname === field);

  // handle file uploads
  const resumeFile = getFile("resume");
  let resumePath = null;

  if (resumeFile) {
    resumePath = await saveUploadedFileToGCS(resumeFile, ["uploads", "resumes"]);
  } else {
    return res.status(400).json({
      success: false,
      message: "Resume file is required",
    });
  }

  const newCareer = await Career.create({
    roleApplyingFor,
    fullName,
    contactNumber,
    emailAddress,
    location,
    coverLetter,
    resume: resumePath,
  });

  res.status(201).json({
    success: true,
    message: "Career application submitted successfully",
    data: newCareer,
  });
});



// ✅ GET: Fetch all career applications
// @route   GET /api/careers
// @access  Admin (or public — up to you)
export const getAllCareers = asyncHandler(async (req, res) => {
  const careers = await Career.find().sort({ createdAt: -1 });

  if (!careers || careers.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No career applications found",
    });
  }

  res.status(200).json({
    success: true,
    count: careers.length,
    data: careers,
  });
});




