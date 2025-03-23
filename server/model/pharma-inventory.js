const mongoose = require("mongoose");

const pharmacyInventorySchema = new mongoose.Schema({
    batchNo: { type: Number, required: true },
    medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true }, // Reference to medication
    quantity: { type: Number, required: true }, // Batch quantity
    expiryDate: { type: Date, required: true }, // Expiry date of the batch
    status: { type: String, enum: ["Active", "Expired"], default: "Active" } // Tracks stock status
}, { timestamps: true });

// Auto-update status based on expiry date
pharmacyInventorySchema.pre("save", function (next) {
    this.status = new Date(this.expiryDate) < new Date() ? "Expired" : "Active";
    next();
});

// Virtual field to check low stock (e.g., if quantity is below 10)
pharmacyInventorySchema.virtual("isLowStock").get(function () {
    return this.quantity < 10; // Change threshold as needed
});

const pharmacyInventoryModel =  mongoose.model('PharmacyInvent', pharmacyInventorySchema)
module.exports = pharmacyInventoryModel

//pharmacist's inventory on their medicines. 