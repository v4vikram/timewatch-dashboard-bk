// controllers/authController.js
import asyncHandler from "express-async-handler";
import AuthModel from "../models/AuthModel.js";
import jwt from "jsonwebtoken";

// POST /api/login
export const login = asyncHandler(async (req, res) => {


  const { email, password } = req.body;

  // Find admin in DB
  const admin = await AuthModel.findOne({ email });
  // console.log("admin", req.body)

  if (!admin || admin.password !== password) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  // Create JWT token
  const token = jwt.sign(
    { email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ success: true, token, user:admin });
});
