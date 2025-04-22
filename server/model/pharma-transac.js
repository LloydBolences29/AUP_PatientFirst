const mongoose = require("mongoose");

const pharmacyTransactionSchema = new mongoose.Schema({
    type: { type: String, enum: [ 'Inpatient Dispense','Emergency Dispense', 'Sold', 'Remove'], required: true },
    medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
    quantity: { type: Number, required: true },
    transactionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'dispensed'], default: 'pending' },
    price: { type: Number } // Only needed for Sold transactions
}, { timestamps: true });

const pharmacyTransactionModel =  mongoose.model('PharmacyTransaction', pharmacyTransactionSchema)
module.exports = pharmacyTransactionModel

//model for all Pharmacist's transaction whether  emergency dispense, sold or remove