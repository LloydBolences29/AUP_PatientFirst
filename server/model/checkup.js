const mongoose = require("mongoose");

const CheckupSchema = new mongoose.Schema(
  {
    visitId: { type: mongoose.Schema.Types.ObjectId, ref: "Visit", required: true },
    icd: [{ type: String, ref: "icdcode"}], // Reference ICD collection
    additionalNotes: { type: String, trim: true },
    patientType: { type: String , enum: ["Outpatient", "Inpatient"], default: "Outpatient"}
  },
  { timestamps: true }
);

const CheckupModel = mongoose.model("Checkup", CheckupSchema);
module.exports = CheckupModel;