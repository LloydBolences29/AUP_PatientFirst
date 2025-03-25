const mongoose  = require("mongoose");


const VisitSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "patientname", required: true }, // Link to patient

  visit_date: { type: Date, default: () => new Date(new Date().toISOString()) }, // Timestamp for visit

  purpose: { 
    type: String, 
    enum: ["Checkup", "Medical Certificate", "Emergency"], 
    required: true 
  },

  // Vital Signs
  blood_pressure: { type: String, required: true }, // Blood Pressure
  temperature: { type: Number, required: true }, // In Celsius
  pulse_rate: { type: Number, required: true },
  respiratory_rate: { type: Number, required: true }, // Respiratory Rate

  // Medical Information
  chief_complaints: { type: String},
  diagnosis: { type: String},
  doctors_additional_notes: { type: String }, // Optional field for extra notes

  // Other Medical Data
  weight: { type: Number, required: true },
  last_menstrual_period: { type: String } // Last Menstrual Period (if applicable)
}, { timestamps: true });


const VisitModel = mongoose.model("Visit", VisitSchema);
module.exports = VisitModel;