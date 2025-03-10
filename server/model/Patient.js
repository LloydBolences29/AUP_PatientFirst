const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  patientID: { type: String, unique: true, required: true },
  name: { type: String, unique: true, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
});

// Create an index to enforce uniqueness in the database
PatientSchema.index({ patientID: 1 }, { unique: true });
PatientSchema.index({ name: 1 }, { unique: true });

const patientModel = mongoose.model("patientname", PatientSchema);
module.exports = patientModel;