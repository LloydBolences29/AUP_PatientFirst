const Patient = require("../model/Patient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");

const router = express.Router();

const accessControl = {
  Patient: ["/dashboard", "/analytics", "/profile"],
    Admin: ["/admin-dashboard", "/admin-management", "/admin-analytics"],
    MedicalRecordsOfficer: ["/medicalRecord-dashboard", "/medicalRecord-management"],
    Nurse: ["/nurse-dashboard", "/patient-management", "/room-management"],
    Doctor: ["/doctor-dashboard", "/doctor-analytics"],
    Cashier: ["/cashier-dashboard", "/payment"],
    Pharmacist: ["/pharma-dashboard", "/pharma-transaction", "/medicine-list"],
    Radiologist: ["/xray-dashboard", "/xray-billing"],
    Laboratory: ["/lab-dashboard", "/lab-billing"],
    lab: ["/lab-dashboard", "/lab-billing", "/lab-upload"],

    
};

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Signup (Register)
const addPatient = async (req, res) => {
  try {
    const {
      patientID,
      religion,
      firstname,
      middleinitial,
      lastname,
      gender,
      age,
      dob,
      civil_status,
      nationality,
      contact_number,
      home_address,
    } = req.body;

    // Validate required fields
    if (!patientID || !firstname || !religion) {
      return res
        .status(400)
        .json({ message: "Patient ID, First Name, and Religion are required" });
    }

    // Check if the patient ID already exists
    const existingPatient = await Patient.findOne({ patientID });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient ID already exists" });
    }

    // Use religion as the temporary password
  

    // Create the patient object
    const newPatient = new Patient({
      patient_id: patientID,
      firstname,
      middleinitial,
      lastname,
      gender,
      age,
      dob,
      civil_status,
      nationality,
      contact_number,
      home_address,
      religion,
      password: religion, // Hash the password before saving
      role: "Patient",
      mustChangePassword: true, // Force user to change password on first login
    });

    // Save patient to database
    await newPatient.save();

    res
      .status(201)
      .json({
        message: "Patient registered successfully",
        patient: newPatient,
      });
  } catch (error) {
    console.error("Error adding patient:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the patient" });
  }
};

// ✅ Login (Set JWT in HTTP-only Cookie)
const login = async (req, res) => {
  try {
    const { patient_ID, password } = req.body;

    console.log("🟡 Received Login Request:", { patient_ID, password });

    // ✅ Check if the patient exists in the database
    const user = await Patient.findOne({ patient_id: patient_ID });
    console.log("🔍 Found User:", user);

    if (!user) {
      console.log("❌ User not found in database!");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // ✅ Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password Match:", isMatch);

    if (!isMatch) {
      console.log("❌ Incorrect password!");
      return res.status(401).json({ message: "Unauthorized: Invalid credentials" });
    }


    const allowedPages = accessControl[user.role] || []; 
    console.log("🔍 Staff Role:", user.role);
    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user.patient_id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    // ✅ Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.json({ message: "Login successful", patient_ID: user.patient_id, role: user.role, token, allowedPages });
  } catch (error) {
    console.error("🔴 Login Error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};


//✅ Logout (Clear Cookie)
// exports.logout = (req, res) => {
//   res.clearCookie("token");
//   res.json({ message: "Logged out successfully" });
// };

module.exports = { addPatient, login };
