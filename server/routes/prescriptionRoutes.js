const express = require("express");
const Prescription = require("../model/Prescription");
const CheckupModel = require("../model/checkup");
const Patient = require("../model/Patient")
const Billing = require("../model/BillingModel"); 
const Medicine = require("../model/medication");// Assuming you have a Billing model defined in models/BillingModel.js
const router = express.Router();

router.get("/fetchPrescriptions", async (req, res) => {
  try {
    const { status } = req.query;
    
    const prescriptions = await Prescription.find({
      status: { $regex: new RegExp(`^${status}$`, "i") }, 
      // patientType: "Outpatient", // Only Outpatients can pick up prescriptions
      prescriptions: { $elemMatch: { type: "medicinal" } }, // Match inside prescriptions array
    })
    .populate("patientId")
    .populate("checkupId");

    return res.json({ prescriptions });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return res.status(500).json({ message: "Error fetching prescriptions" });
  }
});




// Create Prescription
router.post("/createPrescription", async (req, res) => {
  try {
    const { checkupId, patientId, patientType, prescriptions } = req.body;

    const newPrescription = new Prescription({
      checkupId,
      patientId,
      prescriptions,
      patientType, // Store patient type
      status: patientType === "Inpatient" ? "completed" : "pending" // Inpatients do not pick up their meds

    });

    await newPrescription.save();
    res.status(201).json({ message: "Prescription saved successfully!" });
  } catch (error) {
    console.error("Error saving prescription:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "dispensed" or "rejected"

    // Validate status input
    if (!["pending", "dispensed"].includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find and update the prescription
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedPrescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    return res.status(200).json({
      message: `Prescription marked as ${status}`,
      prescription: updatedPrescription,
    });
  } catch (error) {
    console.error("Error updating prescription status:", error);
    return res.status(500).json({ message: "Server error" });
  }
});



router.post("/sendBilling/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const { items } = req.body;

    // Validate patient ID
    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items must be a non-empty array" });
    }

    // Fetch prices from the Medicine collection
    const processedItems = await Promise.all(items.map(async (item) => {
      const medicine = await Medicine.findOne({ name: item.name });

      if (!medicine) {
        throw new Error(`Medicine "${item.name}" not found`);
      }

      return {
        type: "medicine",
        name: item.name,
        quantity: item.quantity,
        price: medicine.price,
        total: item.quantity * medicine.price,
      };
    }));

    const totalAmount = processedItems.reduce((sum, item) => sum + item.total, 0);

    const newBilling = new Billing({
      patientId,
      department: "Pharmacy",
      items: processedItems,
      totalAmount,
      status: "pending",
    });

    await newBilling.save();
    res.status(201).json({ message: "Pharmacy billing created successfully!", billing: newBilling });

  } catch (error) {
    console.error("Error sending billing:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
