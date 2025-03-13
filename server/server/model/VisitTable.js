const mongoose  = require("mongoose");


const VisitSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true }, // Link to patient

  visit_date: { type: Date, default: Date.now }, // Timestamp for visit

  purpose: { 
    type: String, 
    enum: ["Checkup", "Medical Certificate", "Emergency"], 
    required: true 
  },

  // Vital Signs
  bp: { type: String, required: true }, // Blood Pressure
  temperature: { type: Number, required: true }, // In Celsius
  pulse_rate: { type: Number, required: true },
  rrate: { type: Number, required: true }, // Respiratory Rate

  // Medical Information
  chief_complaints: { type: String, required: true },
  diagnosis: { type: String, required: true },
  additional_notes: { type: String }, // Optional field for extra notes

  // Other Medical Data
  weight: { type: Number, required: true },
  lmp: { type: String } // Last Menstrual Period (if applicable)
}, { timestamps: true });

module.exports = mongoose.model("Visit", visitSchema);