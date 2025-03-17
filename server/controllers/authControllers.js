const Patient = require("../model/Patient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");

const router = express.Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Signup (Register)
const addPatient = async (req, res) => {
  try {
      const {
          patientID,
          religion,
          firstname,
          middleInitial,
          lastname,
          gender,
          dob,
          civil_status,
          contact_number,
          home_address
      } = req.body;

      // Validate required fields
      if (!patientID || !firstname || !religion) {
          return res.status(400).json({ message: "Patient ID, First Name, and Religion are required" });
      }

      // Check if the patient ID already exists
      const existingPatient = await Patient.findOne({ patientID });
      if (existingPatient) {
          return res.status(400).json({ message: "Patient ID already exists" });
      }

      // Use religion as the temporary password
      const hashedPassword = await bcrypt.hash(religion, 10);

      // Create the patient object
      const newPatient = new Patient({
          patientID,
          firstname,
          middleInitial,
          lastname,
          gender,
          dob,
          civil_status,
          contact_number,
          home_address,
          religion,
          password: hashedPassword, // Hash the password before saving
          role: "patient",
          mustChangePassword: true // Force user to change password on first login
      });

      // Save patient to database
      await newPatient.save();

      res.status(201).json({ message: "Patient registered successfully", patient: newPatient });
  } catch (error) {
      console.error("Error adding patient:", error);
      res.status(500).json({ message: "An error occurred while adding the patient" });
  }
};

// ✅ Login (Set JWT in HTTP-only Cookie)
const login = async (req, res) => {
  try {
    //gets the patient_ID and password from the request body
    const { patient_ID, password } = req.body;

    //finds the user with the patient_ID and return the message "User not found" if the user is not found
    const user = await Patient.findOne({ patient_ID });
    if (!user) return res.status(400).json({ message: "User not found" });

    //compares the password with the hashed password in the database and return the message "Invalid credentials" if the password is incorrect
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });


    //creates a token with the patient_ID and role and sets the token in a HTTP-only cookie
    const token = jwt.sign(
      { patient_ID: user.patient_ID, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    //sets the token in a HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
    });

    res.json({ message: "Login successful", //show the patientID and role of the user
    patient_ID: user.patient_ID, role: user.password, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

//✅ Logout (Clear Cookie)
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

module.exports = { addPatient, login };
