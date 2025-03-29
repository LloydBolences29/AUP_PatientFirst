const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  checkupId: { type: mongoose.Schema.Types.ObjectId, ref: "Checkup", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patientname", required: true },

  prescriptions: [
    {
      type: { type: String, enum: ["medicinal", "non-medicinal"], required: true },
      
      // Fields for medicinal prescriptions
      medication: { type: String }, 
      dosage: { type: String },
      instruction: { type: String },
      
      
      // Fields for non-medicinal prescriptions
      recommendation: { type: String },
      notes: { type: String },
    }
  ],
  status: { type: String, enum: ["pending", "dispensed", "completed"], default: "pending"},

  createdAt: { type: Date, default: Date.now },
});
const PrescriptionModel = mongoose.model("Prescription", PrescriptionSchema);
module.exports = PrescriptionModel;

