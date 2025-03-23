const mongoose = require("mongoose");
const PatientVisit = require("../model/VisitTable")
const Patient = require("../model/Patient")


const createVisit = async (req, res) => {
    try {
        const {
          patient_id,
          purpose,
          blood_pressure,
          temperature,
          pulse_rate,
          respiratory_rate,
          weight,
          last_menstrual_period,
        } = req.body;
    
        // ✅ Check if patient exists
        const patientExists = await Patient.findById(patient_id);
        if (!patientExists) {
          return res.status(404).json({ message: "Patient not found" });
        }
    
        // ✅ Create new visit record
        const newVisit = new PatientVisit({
          patient_id,
          purpose,
          blood_pressure,
          temperature,
          pulse_rate,
          respiratory_rate,
          weight,
          last_menstrual_period,
        });
    
        // ✅ Save to database
        const savedVisit = await newVisit.save();
    
        res.status(201).json({ message: "Visit recorded successfully", visit: savedVisit });
      } catch (error) {
        console.error("Error recording visit:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    };


    module.exports = { createVisit };