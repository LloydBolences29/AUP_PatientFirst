const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  patientID: { type: Number, required: true, unique: true }, // Ensure unique ID
  firstname: { type: String, required: true }, // No unique constraint here
  age: { type: Number, required: true },
  gender: { type: String, required: true }
});

// Create an index to enforce uniqueness in the database
PatientSchema.index({ patientID: 1 }, { unique: true });
PatientSchema.index({ firstname: 1 }, { unique: true });

const patientModel = mongoose.model("patientname", PatientSchema);
module.exports = patientModel;
