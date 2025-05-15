const mongoose = require("mongoose");
const Medication = require("../model/medication");
const PharmacyInventory = require("../model/pharma-inventory");

const addStock = async (req, res) => {
    try {

        console.log("Received Data:", req.body); // Debugging log

        if (!req.body.quantity || !req.body.expiryDate) {
            return res.status(400).json({ error: "Quantity and expiry date are required." });
        }
        const { medicineId, quantity, expiryDate } = req.body;

        console.log("Received Medicine ID:", medicineId); // Debugging log

        if (!mongoose.Types.ObjectId.isValid(medicineId)) {
            return res.status(400).json({ error: "Invalid medicine ID format." });
        }

        // Check if the medicine exists
        const medicine = await Medication.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ error: "Medicine not found." });
        }

        // Find the highest batch number for this medication
        const lastBatch = await PharmacyInventory.findOne({ medication: medicineId })
            .sort({ batchNo: -1 }) // Sort in descending order
            .select("batchNo"); // Only get batchNo field

        let newBatchNo = 1; // Default to 1 if no batch exists

        if (lastBatch) {
            newBatchNo = lastBatch.batchNo + 1; // Increment batch number
        }

        // Create new stock entry
        const newStock = new PharmacyInventory({
            batchNo: newBatchNo, // Ensure batchNo is unique per medication
            medication: medicineId, // Store reference to the medication
            quantity,
            expiryDate
        });

        await newStock.save();

        const updateMedicineQuantityLeft = await Medication.findByIdAndUpdate(
            medicineId,
            { $inc: { totalQuantityLeft: quantity } },
            { new: true }
        );
        if (!updateMedicineQuantityLeft) {
            return res.status(404).json({ error: "Failed to update medicine quantity." });
        }
       


        res.status(201).json({ message: "Stock added successfully!", data: newStock });
    } catch (error) {
        console.error("Error adding stock:", error);
        res.status(500).json({ error: "Server error. Try again later." });
    }
};


module.exports = { addStock };
