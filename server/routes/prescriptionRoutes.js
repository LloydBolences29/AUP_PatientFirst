const express = require("express");
const Prescription = require("../model/Prescription");
const router = express.Router();

// Create Prescription
router.post("/createPrescription", async (req, res) => {
  try {
    const { checkupId, patientId, doctorId, prescriptions } = req.body;

    const newPrescription = new Prescription({
      checkupId,
      patientId,
      doctorId,
      prescriptions,
    });

    await newPrescription.save();
    res.status(201).json({ message: "Prescription saved successfully!" });
  } catch (error) {
    console.error("Error saving prescription:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;