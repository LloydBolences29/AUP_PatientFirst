const express = require("express");
const router = express.Router();
const Medication = require("../model/medication");
const PharmacyInventory = require("../model/pharma-inventory");
const PharmacyTransaction = require("../model/pharma-transac");
const addStock = require("../controllers/medicineBatchTracker");
const Prescription = require("../model/Prescription");
const Billing = require("../model/BillingModel");
const Patient = require("../model/Patient");

// ✅ GET - Fetch all medicines with total stock left
router.get("/medicines", async (req, res) => {
  try {
    const medicines = await Medication.find();
    return res.json({ medicines });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching medicines", error: error.message });
  }
});

//post billing for emergency dispensing with patientID
router.post("/emergencyDispenceBilling/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const { items, type } = req.body; // Extract the items and type from the body

    console.log("Incoming data:", req.body);

    if (!patientId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find patient by ID
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Log the individual transactions for each medication
    const transactions = items.map(async (med) => {
      // Ensure medication, quantity, and price are defined for each item
      if (!med.medication || !med.quantity || !med.price) {
        throw new Error("Medication, quantity, and price are required for each item");
      }

      const transaction = new PharmacyTransaction({
        type,
        medication: med.medication,
        quantity: med.quantity,
        price: type === "Emergency Dispense" ? med.price : null,
      });

      await transaction.save();
      return transaction; // Return the transaction if you need it for further use
    });

    // Wait for all transactions to be saved
    await Promise.all(transactions);

    // Billing logic
    const billing = new Billing({
      patientId: patient._id,
      department: "Pharmacy",
      items: items.map((med) => ({
        type: "medicine",  // Assuming all items are medicines
        name: med.name,
        medication: med.medication,
        quantity: med.quantity,
        price: med.price,
        total: med.total,
      })),
      totalAmount: items.reduce((total, med) => total + med.total, 0), // Calculate total amount
    });

    await billing.save();

    res.status(201).json({ message: "Transaction recorded successfully" });
  } catch (error) {
    console.error("Error recording transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




router.get("/medicines/search", async (req, res) => {
  try {
    const query = req.query.q || ""; // Get search query
    const medicines = await Medication.find({
      $or: [
        { name: { $regex: `^${query}`, $options: "i" } }, // Search in name
        { brand: { $regex: `^${query}`, $options: "i" } }, // Search in brand
        { manufacturer: { $regex: `^${query}`, $options: "i" } }, // Search in manufacturer
      ],
    }).limit(50); // Limit results to 50
    res.json(medicines);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching medicines", error: error.message });
  }
});

router.post("/add-medicines", async (req, res) => {
  try {
    const { name, brand, manufacturer, dosageForm, strength, price, unit } =
      req.body;

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
    res
      .status(201)
      .json({ message: "Medicine added successfully", medicine: newMedicine });
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
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: error.message });
  }
});

// ✅ POST - Add stock & auto-update medication quantity
router.post("/add-stock", addStock.addStock);

// ✅ PUT - Update medication details (e.g., price, brand)
router.put("/medicine/:id", async (req, res) => {
  try {
    const updatedMedicine = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedMedicine);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating medicine", error: error.message });
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

    const updatedMedicine = await Medication.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res
      .status(200)
      .json({
        message: "Medicine updated successfully",
        medicine: updatedMedicine,
      });
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

    const transaction = await PharmacyTransaction.findById(id).populate(
      "medication",
      "name dosage form"
    );

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
    const { queueNumber, type, medication, quantity, price } =
      req.body;
      console.log("Incoming data:", req.body);

    // Validate request
    if (!type || !medication || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the medication in stock
    const medicineStocks = await PharmacyInventory.find({ medication }).sort({
      expiryDate: 1,
    });

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
      price: type === "Sold" ? price : null,
    });

    await transaction.save();

    const billing = new Billing({
      patientId: req.body.patientId, // Assuming you have the patient ID in the request body
      queueNumber: req.body.queueNumber, // Assuming you have the queue ID in the request body
      department: "Pharmacy",
      items: [
        {
          type: "medicine",
          name: medication,
          quantity,
          price,
          total: price * quantity,
        },
      ],
      totalAmount: price * quantity,
    });
    await billing.save();

    res
      .status(201)
      .json({ message: "Transaction recorded successfully", transaction });
  } catch (error) {
    console.error("Error recording transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/pharmacyPrescriptions", async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      "prescriptions.type": "medicinal",
    }).populate("patientId", "firstname age gender");

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error." });
  }
});

function getDateRange(selectedDate, type) {
  const startDate = new Date(selectedDate);
  let endDate = new Date(selectedDate);

  if (type === "daily") {
    endDate.setDate(startDate.getDate() + 1);
  } else if (type === "monthly") {
    startDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0); // Set the last day of the month
  } else if (type === "yearly") {
    startDate.setMonth(0);
    startDate.setDate(1);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setMonth(0);
    endDate.setDate(0);
  }

  return { startDate, endDate };
}

//for barcharts o total sales
router.get("/getAnalytics", async (req, res) => {
  const { date, type } = req.query; // include 'type' in query string

  if (!date || !type) {
    return res.status(400).json({ error: "Date and type are required" });
  }

  try {
    const selectedDate = new Date(date);
    const { startDate, endDate } = getDateRange(selectedDate, type);

    // Fetch total sales for the specified period
    const analytics = await Billing.aggregate([
      {
        $match: {
          department: "Pharmacy", // hardcoded as you mentioned
          status: "paid",
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalSales = analytics.length > 0 ? analytics[0].totalSales : 0;

    // Fetch sales data over time for the trend (for line chart)
    let dateFormat;
    if (type === "daily") dateFormat = "%Y-%m-%d";
    else if (type === "monthly") dateFormat = "%Y-%m";
    else if (type === "yearly") dateFormat = "%Y";

    const trend = await Billing.aggregate([
      {
        $match: {
          department: "Pharmacy",
          status: "paid",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format the result to match your frontend expectations
    const formattedTrend = trend.map((item) => ({
      date: item._id,
      sales: item.totalSales,
    }));

    // Send both analytics and trend data
    res.json({
      analytics: {
        date,
        type,
        totalSales,
      },
      trend: formattedTrend,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//for getting the peak times
router.get("/getPeakTimes", async (req, res) => {
  try {
    const result = await Billing.aggregate([
      {
        $project: {
          hour: { $hour: "$createdAt" }, // Extract the hour from createdAt
          totalSales: 1,
        },
      },
      {
        $group: {
          _id: "$hour", // Group by hour (0 to 23)
          count: { $sum: 1 }, // Number of transactions in this hour
          totalSales: { $sum: "$totalSales" }, // Total sales in this hour
        },
      },
      {
        $sort: { _id: 1 }, // Sort by hour ascending
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting peak times:", error);
    res.status(500).json({ message: "Failed to get peak times" });
  }
});

//get the most bought medicines
router.get("/most-bought-medicines", async (req, res) => {
  try {
    const result = await Billing.aggregate([
      { $match: { department: "Pharmacy" } },
      { $unwind: "$items" },
      { $match: { "items.type": "medicine" } },
      {
        $group: {
          _id: "$items.name",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
    ]);

    const formatted = result.map((item) => ({
      name: item._id,
      value: item.totalQuantity,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//total sales for the line chart
// total sales for the line chart
router.get("/sales-over-time", async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Type is required" });
  }

  let dateFormat;
  if (type === "daily") dateFormat = "%Y-%m-%d";
  else if (type === "monthly") dateFormat = "%Y-%m";
  else if (type === "yearly") dateFormat = "%Y";

  try {
    const result = await Billing.aggregate([
      {
        $match: {
          department: "Pharmacy",
          status: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = result.map((item) => ({
      date: item._id,
      sales: item.totalSales,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error generating chart data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
