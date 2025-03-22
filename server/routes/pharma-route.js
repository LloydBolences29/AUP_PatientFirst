const express = require("express");
const router = express.Router();
const Medication = require("../model/medication");
const PharmacyInventory = require("../model/pharma-inventory");
const PharmacyTransaction = require("../model/pharma-transac");

// ✅ GET - Fetch all medicines with total stock left
router.get("/medicines", async (req, res) => {
    try {
        const medicines = await Medication.find();
        return res.json({ medicines });
    } catch (error) {
        res.status(500).json({ message: "Error fetching medicines", error: error.message });
    }
});

router.post("/add-medicines", async (req, res) => {
    try {
        const { name, brand, manufacturer, dosageForm, strength, price, unit } = req.body;

        // Check if medicine already exists
        const existingMedicine = await Medication.findOne({ name });
        if (existingMedicine) {
            return res.status(400).json({ message: "Medicine already exists" });
        }

        const newMedicine = new Medication({
            name,
            brand,
            manufacturer,
            dosageForm,
            strength,
            price,
            unit,
            totalQuantityLeft: 0, // Start with zero stock
        });

        await newMedicine.save();
        res.status(201).json({ message: "Medicine added successfully", medicine: newMedicine });
    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ GET - Fetch inventory with medication details
router.get("/getStock", async (req, res) => {
    try {
        const inventory = await PharmacyInventory.find().populate("medication");
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching inventory", error: error.message });
    }
});

// ✅ POST - Add stock & auto-update medication quantity
router.post("/add-stock", async (req, res) => {
    try {
        const { medicationId, quantity, expiryDate } = req.body;

        let medication = await Medication.findById(medicationId);
        if (!medication) {
            return res.status(404).json({ message: "Medication not found" });
        }

        // ✅ Find the latest batch number & increment it
        const lastBatch = await PharmacyInventory.findOne().sort({ batchNo: -1 });
        let newBatchNo = lastBatch ? parseInt(lastBatch.batchNo) + 1 : 1; // Default to 1 if no batch exists

        const newStock = new PharmacyInventory({ 
            batchNo: newBatchNo.toString(), // Auto-increment batchNo
            medication: medicationId, 
            quantity, 
            expiryDate 
        });

        await newStock.save();

        medication.totalQuantityLeft += quantity;
        await medication.save();

        const savedStock = await PharmacyInventory.findById(newStock._id)
            .populate("medication");

        res.status(201).json({ 
            message: "Stock added successfully", 
            newStock: savedStock,   
            updatedMedication: medication 
        });

    } catch (error) {
        res.status(500).json({ message: "Error adding stock", error: error.message });
    }
});

// ✅ PUT - Update medication details (e.g., price, brand)
router.put("/medicine/:id", async (req, res) => {
    try {
        const updatedMedicine = await Medication.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMedicine);
    } catch (error) {
        res.status(400).json({ message: "Error updating medicine", error: error.message });
    }
});

// ✅ POST - Handle transactions (Purchase, Sold, Emergency Dispense, Remove)
router.post("/add-transaction", async (req, res) => {
    try {
        const { type, medication, quantity, price } = req.body;

        let foundMedication = await Medication.findById(medication);
        if (!foundMedication) {
            return res.status(404).json({ message: "Medication not found" });
        }

        if (type === "Purchase") {
            // ✅ Find the latest batch number & increment it
            const lastBatch = await PharmacyInventory.findOne().sort({ batchNo: -1 });
            let newBatchNo = lastBatch ? parseInt(lastBatch.batchNo) + 1 : 1; 

            const newStock = new PharmacyInventory({ 
                batchNo: newBatchNo.toString(), // Auto-increment batchNo
                medication, 
                quantity, 
                expiryDate: req.body.expiryDate 
            });

            await newStock.save();
            foundMedication.totalQuantityLeft += quantity;
            await foundMedication.save();
        } 
        else if (type === "Sold" || type === "Emergency Dispense" || type === "Remove") {
            const stock = await PharmacyInventory.findOne({ medication }).sort({ expiryDate: 1 });

            if (!stock || stock.quantity < quantity) {
                return res.status(400).json({ message: "Not enough stock available" });
            }

            stock.quantity -= quantity;
            if (stock.quantity <= 0) {
                await PharmacyInventory.findByIdAndDelete(stock._id);
            } else {
                await stock.save();
            }

            foundMedication.totalQuantityLeft -= quantity;
            if (foundMedication.totalQuantityLeft < 0) foundMedication.totalQuantityLeft = 0;
            await foundMedication.save();
        }

        const newTransaction = new PharmacyTransaction({ type, medication, quantity, price });
        await newTransaction.save();

        res.status(201).json({ message: "Transaction recorded successfully", transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ message: "Error processing transaction", error: error.message });
    }
});

// ✅ PUT - Update medicine details
router.put("/update-medicine/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const medicine = await Medication.findById(id);
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        const updatedMedicine = await Medication.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ message: "Medicine updated successfully", medicine: updatedMedicine });
    } catch (error) {
        console.error("Error updating medicine:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ GET - Fetch all transactions
router.get("/transactions", async (req, res) => {
    try {
        const transactions = await PharmacyTransaction.find().populate("medication");
        res.json({ transactions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error: error.message });
    }
});

module.exports = router;
