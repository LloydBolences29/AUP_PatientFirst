const express = require("express");
const router = express.Router(); // ✅ Use express.Router()
const patientModel = require("../model/Patient.js");

// GET - Fetch all patients
router.get("/", async (req, res) => {
    try {
        const response = await patientModel.find();
        return res.json({ patientname: response });
    } catch (error) {
        res.status(500).json({ message: "Error fetching patients", error: error.message });
    }
});
// POST - Add new patient with validation
// router.post("/", async (req, res) => {
//     console.log("Headers:", req.headers);
//     console.log("Body:", req.body);
//     try {
//         const { patientID, firstname, lastname, age, gender } = req.body;

//         // Check if all required fields are provided
//         if (!patientID || !firstname || !lastname || !age || !gender) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         // Check if a patient with the same first and last name exists
//         const existingPatient = await patientModel.findOne({ firstname, lastname });
//         if (existingPatient) {
//             return res.status(400).json({ message: "Patient already exists" });
//         }

//         // Add new patient
//         const newPatient = new patientModel(req.body);
//         await newPatient.save();

//         res.status(201).json({ message: "Patient added successfully", patient: newPatient });
//     } catch (error) {
//         res.status(500).json({ message: "Error adding patient", error: error.message });
//     }
// });


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
  const patientID = parseInt(req.params.patient_id, 10); // Convert to number
  const { firstname, age, gender } = req.body;

  try {
      const updatedPatient = await patientModel.findOneAndUpdate(
          {patient_id: patientID} , // ✅ Ensure numeric match
          { firstname, age, gender },
          { new: true }
      );

      if (!updatedPatient) {
          return res.status(404).json({ message: "Patient not found" });
      }

      res.json(updatedPatient);
  } catch (error) {
      res.status(500).json({ message: "Error updating patient", error: error.message });
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
        res.status(500).json({ message: "Error deleting patient", error: error.message });
    }
});

module.exports = router;
