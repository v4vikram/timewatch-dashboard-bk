import asyncHandler from "express-async-handler";
import LandingPopup from "../models/LandingPopup.js";

import { sendEmailToCompany, sendMessageToCustomer } from "../services/email.service.js";
import { generateEmailHTML } from "../utils/emailTemplate.js";



export const landingPopupForm = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        res.status(400);
        throw new Error("Name and email are required");
    }

    // Save to DB
    const popupEntry = new LandingPopup({ name, email });
    await popupEntry.save();

    // Send email to company team
    sendEmailToCompany({
        to: ["v4vikram.dev@gmail.com", "sales@timewatchindia.com", "marketing@timewatchindia.com"],
        subject: "New Landing Page Popup Submission",
        html: generateEmailHTML({ name, email }, "New Landing Page Popup Submission"),
    });

    res.status(201).json({
        success: true,
        message: "Landing page popup submitted successfully",
        data: popupEntry,
    });
});
