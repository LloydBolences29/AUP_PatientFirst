const mongoose = require("mongoose");

const CheckupSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patientname", required: true },
    icd: [{ type: String, ref: "icdcode", required: true }], // Reference ICD collection
    additionalNotes: { type: String, trim: true },
    prescription: [{type: mongoose.Schema.Types.ObjectId, ref: "Prescription"}]
  },
  { timestamps: true }
);

const CheckupModel = mongoose.model("Checkup", CheckupSchema);
module.exports = CheckupModel;