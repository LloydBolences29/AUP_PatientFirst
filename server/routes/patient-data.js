const express = require("express");
const router = express();
const patientModel = require("../model/Patient.js");




//API fetching for the patient model
router.get("/", async (req, res) => {
    try {
      const response = await patientModel.find();
      return res.json({ patientname: response });
    } catch (error) {
      res.status(500).json({ message: "Error fetching patients", error: error.message });
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
  
  // PUT - Update patient by ID
  router.put("/:patientID", async (req, res) => {
    const { patientID } = req.params;
    const { firstname, age, gender } = req.body;
  
    try {
      const updatedPatient = await patientModel.findOneAndUpdate(
        { patientID }, // Find by patientID
        { firstname, age, gender }, // Update fields
        { new: true } // Return updated document
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

  