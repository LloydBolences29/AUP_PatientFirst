const mongoose = require("mongoose");



const medicationSchema = new mongoose.Schema(
  {
    genericName: { type: String, required: true,  }, // Medication name (e.g., Paracetamol)
    brand: { type: String, required: true, unique: true }, // Brand name (e.g., Tylenol)
    manufacturer: { type: String }, // Manufacturer (e.g., Pfizer)
    dosageForm: { type: String, required: true , enum: ['Capsule', 'Tablet', 'Syrup','Other']}, // Tablet, Capsule, Syrup, etc.
    strength: { type: String, required: true }, // 500mg, 250mg, etc.
    price: { type: Number, required: true }, // Price per unit
    unit: { type: String, required: true }, // Tablets, mL, etc.
    totalQuantityLeft: { type: Number, default: 0 }, // Tracks total stock left across batches
    description: { type: String }, // Optional details
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);




const medicationModel = mongoose.model("Medication", medicationSchema);
module.exports = medicationModel;
