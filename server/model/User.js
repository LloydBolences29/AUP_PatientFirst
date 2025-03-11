const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  patient_ID: {
    type: mongoose.Schema.Types.String,
    ref: "Patient",
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['patient', 'admin', 'doctor', 'nurse'] },
}, { timestamps: true });
const User = mongoose.model("User", UserSchema);
module.exports = User;