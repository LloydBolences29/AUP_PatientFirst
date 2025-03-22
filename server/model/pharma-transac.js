const mongoose = require("mongoose");

const pharmacyTransactionSchema = new mongoose.Schema({
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    type: { type: String, enum: ['Purchase', 'Emergency Dispense', 'Sold', 'Remove'], required: true },
    medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
    quantity: { type: Number, required: true },
    transactionDate: { type: Date, default: Date.now },
    price: { type: Number } // Only needed for Sold transactions
}, { timestamps: true });

const pharmacyTransactionModel =  mongoose.model('PharmacyTransaction', pharmacyTransactionSchema)
module.exports = pharmacyTransactionModel

//model for all Pharmacist's transaction whether purchace, emergency dispense, sold or remove