const mongoose = require("mongoose");

const MedcertSchema = new mongoose.Schema(
  {
   patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    patientType: { type: String , default: "Outpatient"}
  },
  { timestamps: true }
);

const Medcert = mongoose.model("medcertModel", MedcertSchema);
module.exports = Medcert;