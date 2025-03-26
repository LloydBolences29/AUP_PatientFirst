const express = require("express");
const router = express.Router();
const Checkup = require("../model/checkup");
const patient = require("../model/patient"); // Import Patient model
const ICD = require("../model/icdcode"); // Import ICD-10 model

// 🔹 Create a new checkup with multiple ICD-10 codes
router.post("/", async (req, res) => {
  try {
    const { patientId, icdCodes, prescription, additionalNotes } = req.body;

    // ✅ Validate Input
    if (!patientId || !Array.isArray(icdCodes) || icdCodes.length === 0) {
      return res.status(400).json({ message: "Patient ID and at least one ICD code are required." });
    }

    // ✅ Check if Patient Exists
    const patientExists = await patient.findById(patientId);
if (!patientExists) {
  return res.status(400).json({ message: "Invalid patient ID. Please check the patient record." });
}


    // ✅ Validate ICD-10 Codes
    const validICDs = await ICD.find({ _id: { $in: icdCodes } });
    if (validICDs.length !== icdCodes.length) {
      return res.status(400).json({ message: "Some ICD codes are invalid." });
    }

    // ✅ Create Checkup Record
    const newCheckup = new Checkup({
      patientId,
      icdCodes, // Stores ICD-10 codes as an array of ObjectIds
      prescription,
      additionalNotes,
    });

    await newCheckup.save();
    res.status(201).json({ message: "Checkup recorded successfully.", checkup: newCheckup });
  } catch (error) {
    console.error("Error creating checkup:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// 🟢 Get All Checkups with ICD-10 Details
router.get("/", async (req, res) => {
  try {
    const checkups = await Checkup.find()
      .populate("patientId", "firstname age gender") // Populate patient details
      .populate("icdCodes", "code shortdescription"); // Populate ICD-10 details

    res.status(200).json(checkups);
  } catch (error) {
    console.error("Error fetching checkups:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
