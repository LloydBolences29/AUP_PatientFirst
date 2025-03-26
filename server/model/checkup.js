const mongoose = require("mongoose");

const CheckupSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    prescription: { type: String, trim: true },
    icd: [{ type: mongoose.Schema.Types.ObjectId, ref: "ICD", required: true }], // Reference ICD collection
    additionalNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

const CheckupModel = mongoose.model("Checkup", CheckupSchema);
module.exports = CheckupModel;