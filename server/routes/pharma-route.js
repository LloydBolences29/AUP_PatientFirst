const express = require("express");
const router = express.Router();
const Medication = require("../model/medication");
const PharmacyInventory = require("../model/pharma-inventory");
const PharmacyTransaction = require("../model/pharma-transac");
const addStock = require("../controllers/medicineBatchTracker")
const Prescription = require("../model/Prescription")
const Billing = require("../model/BillingModel")


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
router.post("/add-stock", addStock.addStock);

// ✅ PUT - Update medication details (e.g., price, brand)
router.put("/medicine/:id", async (req, res) => {
    try {
        const updatedMedicine = await Medication.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMedicine);
    } catch (error) {
        res.status(400).json({ message: "Error updating medicine", error: error.message });
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

// ✅ Get all transactions
router.get("/transactions", async (req, res) => {
    try {
        const transactions = await PharmacyTransaction.find()
            .populate("medication", "name dosage form") // Populate medication details
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get a specific transaction by ID
router.get("/transactions/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await PharmacyTransaction.findById(id)
            .populate("medication", "name dosage form");

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error fetching transaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// Create a new transaction
router.post("/add-transactions", async (req, res) => {
    try {
        const { type, medication, quantity, price } = req.body;

        // Validate request
        if (!type || !medication || !quantity) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the medication in stock
        const medicineStocks = await PharmacyInventory.find({ medication }).sort({ expiryDate: 1 });

        if (!medicineStocks.length) {
            return res.status(404).json({ message: "Medicine not found in stock" });
        }

        let remainingQuantity = quantity;
        let updatedBatches = [];

        for (let stock of medicineStocks) {
            if (remainingQuantity <= 0) break;

            if (stock.quantity >= remainingQuantity) {
                stock.quantity -= remainingQuantity;
                remainingQuantity = 0;
            } else {
                remainingQuantity -= stock.quantity;
                stock.quantity = 0;
            }

            updatedBatches.push(stock);
            await stock.save();
        }

        if (remainingQuantity > 0) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        // Log the transaction
        const transaction = new PharmacyTransaction({
            type,
            medication,
            quantity,
            price: type === "Sold" ? price : null
        });

        await transaction.save();

        res.status(201).json({ message: "Transaction recorded successfully", transaction });

    } catch (error) {
        console.error("Error recording transaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/pharmacyPrescriptions", async (req, res) => {
    try {
      const prescriptions = await Prescription.find({ "prescriptions.type": "medicinal" })
        .populate("patientId", "firstname age gender");
  
      res.status(200).json(prescriptions);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      res.status(500).json({ message: "Server error." });
    }
  });

  const getDateRange = (date, type) => {
    let startDate, endDate;
  
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  
    if (type === "daily") {
      startDate = new Date(utcDate);
      endDate = new Date(utcDate);
      endDate.setUTCHours(23, 59, 59, 999);
    } else if (type === "monthly") {
      startDate = new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), 1));
      endDate = new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));
    } else if (type === "yearly") {
      startDate = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
      endDate = new Date(Date.UTC(utcDate.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
    } else {
      throw new Error("Invalid type specified");
    }
  
    return { startDate, endDate };
  };
  
  router.get("/getAnalytics", async (req, res) => {
    const { date, type } = req.query; // include 'type' in query string
  
    if (!date || !type) {
      return res.status(400).json({ error: "Date and type are required" });
    }
  
    try {
      const selectedDate = new Date(date);
      const { startDate, endDate } = getDateRange(selectedDate, type);
  
      const analytics = await Billing.aggregate([
        {
          $match: {
            department: "Pharmacy", // hardcoded as you mentioned
            status: "paid",
            createdAt: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" }
          }
        }
      ]);
  
      const totalSales = analytics.length > 0 ? analytics[0].totalSales : 0;
  
      res.json({ date, type, totalSales });
    } catch (error) {
      console.error("Error fetching sales data:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
  });


  router.get('/getPeakTimes', async (req, res) => {
    try {
      const result = await Billing.aggregate([
        {
          $project: {
            hour: { $hour: "$createdAt" },  // Extract the hour from createdAt
            totalSales: 1
          }
        },
        {
          $group: {
            _id: "$hour", // Group by hour (0 to 23)
            count: { $sum: 1 }, // Number of transactions in this hour
            totalSales: { $sum: "$totalSales" } // Total sales in this hour
          }
        },
        {
          $sort: { _id: 1 } // Sort by hour ascending
        }
      ]);
  
      res.status(200).json(result);
    } catch (error) {
      console.error("Error getting peak times:", error);
      res.status(500).json({ message: 'Failed to get peak times' });
    }
  });
  
  
  



module.exports = router;
