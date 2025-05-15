const express = require("express");
const router = express.Router();
const Checkup = require("../model/checkup");
const Patient = require("../model/Patient"); // Import Patient model
const ICD = require("../model/icdcode"); // Import ICD-10 model
const Billing = require("../model/BillingModel");
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
    const { visitId, patientId, doctorFee, icd, additionalNotes, patientType } =
      req.body;

    // ✅ Validate Inputs
    if (!patientId || !Array.isArray(icd) || icd.length === 0) {
      return res
        .status(400)
        .json({
          message: "Patient ID and at least one ICD code are required.",
        });
    }

    // ✅ Check if Patient Exists
    const patientExists = await Patient.findById(patientId);
    if (!patientExists) {
      return res
        .status(400)
        .json({
          message: "Invalid patient ID. Please check the patient record.",
        });
    }

    // ✅ Validate ICD-10 Codes
    const validICDs = await ICD.find({ _id: { $in: icd } });
    if (validICDs.length !== icd.length) {
      return res.status(400).json({ message: "Some ICD codes are invalid." });
    }

    // ✅ Create Checkup Record (No prescriptions here)
    const newCheckup = new Checkup({
      visitId,
      patientId,
      icd, // Stores ICD-10 codes as an array of ObjectIds
      additionalNotes,
      patientType,
    });

    await newCheckup.save();

    // **2. Automatically Generate Billing for Doctor’s Fee**
    const doctorBilling = new Billing({
      patientId,
      department: "Consultation",
      items: [
        {
          type: "doctor-fee",
          name: "Doctor's Consultation Fee",
          price: doctorFee,
          quantity: 1,
          total: doctorFee,
        },
      ],
      totalAmount: doctorFee,
      status: "pending",
    });

    await doctorBilling.save();

    res.status(201).json({
      message: "Checkup recorded & doctor's fee billed successfully",
      checkup: newCheckup,
      billing: doctorBilling,
      checkupId: newCheckup._id,
    });

    // ✅ Return the created checkup _id
  } catch (error) {
    console.error("Error creating checkup:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Get All Checkups with ICD-10 Details
router.get("/getCheckup", async (req, res) => {
  try {
    const checkups = await Checkup.find()
      .populate({
        path: "visitId",
        populate: {
          path: "patient_id",
          model: "patientname", // Name of the model you're referencing
          // You can customize what fields to return
        }, // What to return from Visit
      })
      .populate("icd", "code shortdescription"); // Populate ICD-10 details

    res.status(200).json(checkups);
  } catch (error) {
    console.error("Error fetching checkups:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/getCertainCheckup/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const checkups = await Checkup.find()
      .populate({
        path: "visitId",
        populate: { 
          path: "patient_id",
          model: "patientname", // Name of the model you're referencing
          match: { patient_id: patientId },
        }, // What to return from Visit
      })
      .populate("icd", "code shortdescription"); // Populate ICD-10 details

    res.status(200).json(checkups);
  } catch (error) {
    console.error("Error fetching checkups:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.put("/updatePatientType/:checkupId", async (req, res) => {
  try {
    const { checkupId } = req.params;
    const { patientType } = req.body;

    if (!["Outpatient", "Inpatient"].includes(patientType)) {
      return res.status(400).json({ message: "Invalid patient type" });
    }

    const updatedCheckup = await Checkup.findByIdAndUpdate(
      checkupId,
      { patientType },
      { new: true }
    );

    if (!updatedCheckup) {
      return res.status(404).json({ message: "Checkup not found" });
    }

    res.json({
      message: "Patient type updated successfully",
      checkup: updatedCheckup,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating patient type", error: error.message });
  }
});


router.get("/getCertainCheckup/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const checkups = await Checkup.find()
      .populate({
        path: "visitId",
        populate: { 
          path: "patient_id",
          model: "patientname", // Name of the model you're referencing
          match: { patient_id: patientId },
        }, // What to return from Visit
      })
      .populate("icd", "code shortdescription"); // Populate ICD-10 details

    res.status(200).json(checkups);
  } catch (error) {
    console.error("Error fetching checkups:", error);
    res.status(500).json({ message: "Server error." });
  }
});



module.exports = router;
