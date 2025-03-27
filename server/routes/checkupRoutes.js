const express = require("express");
const router = express.Router();
const Checkup = require("../model/checkup");
const Patient = require("../model/patient"); // Import Patient model
const ICD = require("../model/icdcode"); // Import ICD-10 model
const Prescription = require("../model/Prescription");



router.get("/icd10", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = parseInt(req.query.limit) || 50; // Default limit = 50 per page
    const skip = (page - 1) * limit;

    const icdCodes = await ICD.find().skip(skip).limit(limit);
    const total = await ICD.countDocuments();

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: icdCodes,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching ICD codes" });
  }
});

router.get("/icd10/search", async (req, res) => {
  try {
    const query = req.query.q || ""; // Get search query
    const icdCodes = await ICD.find({
      $or: [
        { code: { $regex: `^${query}`, $options: "i" } }, // Search in code
        { shortDescription: { $regex: query, $options: "i" } }, // Search in short description
      ],
    }).limit(50); // Limit results to 50

    res.json(icdCodes);
  } catch (error) {
    res.status(500).json({ error: "Server error while searching ICD codes" });
  }
});
// 🔹 Create a new checkup with multiple ICD-10 codes
router.post("/create-new", async (req, res) => {
  try {
    const { patientId, icd, prescriptions, additionalNotes } = req.body;

    if (!patientId || !Array.isArray(icd) || icd.length === 0) {
      return res.status(400).json({ message: "Patient ID and at least one ICD code are required." });
    }

    // ✅ Check if Patient Exists
    const patientExists = await Patient.findById(patientId);
    if (!patientExists) {
      return res.status(400).json({ message: "Invalid patient ID. Please check the patient record." });
    }

    // ✅ Validate ICD-10 Codes
    const validICDs = await ICD.find({ _id: { $in: icd } });
    if (validICDs.length !== icd.length) {
      return res.status(400).json({ message: "Some ICD codes are invalid." });
    }

    // ✅ Create Checkup First
    const newCheckup = new Checkup({
      patientId,
      icd, 
      additionalNotes,
    });

    await newCheckup.save(); // ✅ Save to get the new `_id`

    // ✅ Now Create Prescription with the Checkup ID
    const newPrescription = await Prescription.create({
      patientId,
      checkupId: newCheckup._id, // ✅ Assign the newly created checkup ID
      prescriptions,
    });

    // ✅ Update Checkup with Prescription ID (Optional)
    newCheckup.prescriptionId = newPrescription._id;
    await newCheckup.save();

    res.status(201).json({ message: "Checkup and prescription recorded successfully!" });

  } catch (error) {
    console.error("Error creating checkup:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// 🟢 Get All Checkups with ICD-10 Details
router.get("/getCheckup", async (req, res) => {
  try {
    const checkups = await Checkup.find()
      .populate("patientId", "firstname age gender") // Populate patient details
      .populate("icd", "code shortdescription"); // Populate ICD-10 details

    res.status(200).json(checkups);
  } catch (error) {
    console.error("Error fetching checkups:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
