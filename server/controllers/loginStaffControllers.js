const Staff = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const accessControl = {
  Patient: ["/dashboard", "/analytics", "/profile"],
    Admin: ["/admin-dashboard", "/admin-management", "/admin-analytics"],
    MedicalRecordsOfficer: ["/medicalRecord-dashboard", "/medicalRecord-management"],
    Nurse: ["/nurse-dashboard", "/patient-management", "/nurse-analytics"],
    Doctor: ["/doctor-dashboard", "/doctor-patient-management"],
    Cashier: ["/cashier-dashboard", "/payment"],
    Pharmacist: ["/pharma-dashboard", "/pharma-transaction", "/medicine-list", "/prescription-page"],
    Radiologist: ["/xray-dashboard", "/xray-billing"]
};


const loginStaff = async (req, res) => {
  console.log("🟠 Incoming Login Request:", req.body);

  try {
    const { role_ID, password } = req.body;
    console.log("role id:", role_ID);
    console.log("Password:", password);

    // Check if staff exists
    const staff = await Staff.findOne({ role_ID });
    if (!staff) return res.status(400).json({ message: "Staff not found" });

    // Validate password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    console.log("🟢 Staff Authenticated:", staff);

    // Ensure allowedPages always exists
   
    const allowedPages = accessControl[staff.role] || []; 
    console.log("🔍 Staff Role:", staff.role);
    // Generate Token
    const token = jwt.sign(
      { staff_id: staff.role_ID, role: staff.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );


    console.log("Generated Token (Backend):", token);

    // Set HttpOnly cookie for token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "Strict",
    });

    // Send final response
    res.json({
      message: "Login successful",
      role_ID: staff.role_ID,
      role: staff.role,
      token,
      allowedPages, // ✅ Always included
    });

  } catch (error) {
    console.error("🔴 Backend Error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Logout function (fixed parameter order)
const logOutUser = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logout Successfully" });
};

module.exports = { loginStaff, logOutUser };
