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
    try {
      const { patientID, name, age, gender } = req.body;
  
      // Convert name to lowercase for case-insensitive validation
      const existingPatient = await patientModel.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        age,
        gender
      });
  
      if (existingPatient) {
        return res.status(400).json({ message: "Patient record already exists." });
      }
  
      // Create and save new patient
      const newPatient = new patientModel(req.body);
      await newPatient.save();
      res.status(201).json(newPatient);
    } catch (error) {
      res.status(500).json({ message: "Error adding patient. The patient might existing. Check the record first", error: error.message });
    }
  });
  
  // PUT - Update patient by ID
router.put("/:id", async (req, res) => {
    try {
      const updatedPatient = await patientModel.findOneAndUpdate(
        { patientID: req.params.id }, // Find by patientID
        req.body,
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

  