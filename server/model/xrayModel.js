// models/XrayProcedure.js
const mongoose = require("mongoose");

const ProcedureSchema = new mongoose.Schema({
  Procedure: { type: String, required: true }, // Name of the procedure
  Price: { type: Number, required: true }, // Price for the procedure
});

const XrayCategorySchema = new mongoose.Schema({
  Category: { type: String, required: true }, // e.g. SKULL
  Procedures: { type: [ProcedureSchema], required: true }, // Array of procedures with Procedure name and Price
});

const xrayModel = mongoose.model("Xray", XrayCategorySchema);
module.exports = xrayModel;
