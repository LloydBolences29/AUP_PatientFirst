const mongoose = require("mongoose");
const { head } = require("../routes/protectedRoutes");
const bcrypt = require('bcryptjs');


const PatientSchema = new mongoose.Schema({
  patient_id: { type: String, unique: true, required: true }, // Login ID (same as ObjectId)
  password: { type: String, required: true }, // Hashed password
  role: { type: String, default: "Patient" }, // Default role for login

  // Personal Information
  firstname: { type: String, required: true },
  middleinitial: { type: String },
  lastname: { type: String, required: true },
  contact_number: { type: String, required: true },
  home_address: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  civil_status: { type: String, required: true, enum: ["Single", "Married", "Divorced", "Widowed"] },
  nationality: { type: String, required: true },
  bloodType: {type: String, default: null},
  religion: { type: String, required: true },
  passwordChanged: { type: Boolean, default: false },

  medical_history: {type: [String], default: null},
  surgical_history: {type: [String], default: null},
  allergies: {type: [String], default: null},
  medications: {type: [String], default: null},
  vax_history: {type: [String], default: null},

  // Optional Fields
  student_id: { type: String, default: null },
  campus_address: { type: String, default: null },
  guardian_name: { type: String, default: null },
  guardian_contact: { type: String, default: null },

  //for emergency contacts
  emergency_name: { type: String, default: null },
  emergency_relationship: { type: String, default: null },
  emergency_phone: { type: String, default: null },
}, { timestamps: true });

// Hash password before saving
PatientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
});

// // Create an index to enforce uniqueness in the database
// PatientSchema.index({ patient_id: 1 }, { unique: true });
// PatientSchema.index({ firstname: 1 }, { unique: true });

const patientModel = mongoose.models.patientname || mongoose.model("patientname", PatientSchema);
module.exports = patientModel;
