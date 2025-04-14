const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  role_ID: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  role: { type: String, required: true, enum: ['Admin', 'Doctor', 'Nurse', 'MedicalRecordsOfficer', 'Cashier', 'Pharmacist', 'Radiologist']}
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("user", UserSchema);
module.exports = User;