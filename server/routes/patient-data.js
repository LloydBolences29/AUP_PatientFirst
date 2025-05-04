const express = require("express");
const router = express.Router(); // ✅ Use express.Router()
const patientModel = require("../model/Patient.js");
const jwt = require("jsonwebtoken");



// GET - Fetch all patients
router.get("/", async (req, res) => {
  try {
    const response = await patientModel.find();
    return res.json({ patientname: response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching patients", error: error.message });
  }
});

//for fetching patient data according to their id
router.get("/:patient_id", async (req, res) => {
  try {
    const { patient_id } = req.params;

    let patient = await patientModel.findOne({ patient_id }); // 🔎 Search by patient_id first

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.json({ patient });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching patient", error: error.message });
  }
});

// POST - Add new patient with validation
router.post("/", async (req, res) => {
  const { firstname } = req.body;

  // Check if patient already exists
  const existingPatient = await patientModel.findOne({ firstname });
  if (existingPatient) {
    return res.status(400).json({ message: "Patient already exists" });
  }

  // Add new patient
  const newPatient = new patientModel(req.body);
  await newPatient.save();
  res.status(201).json(newPatient);
});

// 🔄 PUT - Update patient by ID
router.put("/:patient_id", async (req, res) => {
  const { patient_id } = req.params; // Extract patient_id from URL
  const updateData = req.body; // Extract only the fields sent in request

  try {
    console.log("🔄 Updating patient with ID:", patient_id);

    // Ensure the request body isn't empty
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "⚠️ No update data provided." });
    }

    // Find and update patient
    const updatedPatient = await patientModel.findOneAndUpdate(
      { patient_id }, // Search by patient_id
      { $set: updateData }, // Update only provided fields
      { new: true } // Return updated document
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "❌ Patient not found" });
    }

    res.json({ message: "✅ Patient updated successfully", patient: updatedPatient });
  } catch (error) {
    console.error("❌ Error updating patient:", error);
    res.status(500).json({ message: "⚠️ Error updating patient", error: error.message });
  }
});



// DELETE - Remove patient by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedPatient = await patientModel.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting patient", error: error.message });
  }
});

//get the current user info from the token
router.get("/auth/me", (req, res) => {
  try {
    console.log("Cookies received:", req.cookies); // Debug
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ id: decoded.id });
  } catch (err) {
    console.error("JWT Verification Failed:", err);
    res.status(403).json({ error: "Invalid token" });
  }
});

module.exports = router;
