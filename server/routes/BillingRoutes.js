const express = require("express");
const mongoose = require("mongoose");
const Billing = require("../model/BillingModel"); // Assuming you have a Billing model defined in models/BillingModel.js
const router = express.Router();

// **1. Create a new billing record (Auto-assign department)**
router.post("/create", async (req, res) => {
    try {
        const { patientId, items } = req.body;
    
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
          return res.status(400).json({ message: "Invalid patient ID" });
        }
    
        if (!items || items.length === 0) {
          return res.status(400).json({ message: "Items are required" });
        }
    
        // **Determine department based on the type of items**
        let department = "";
        if (items.some(item => item.type === "medicine")) {
          department = "Pharmacy";
        } else if (items.some(item => item.type === "procedure" && ["dental"].includes(item.name.toLowerCase()))) {
          department = "Dental";
        } else if (items.some(item => item.type === "procedure" && ["xray"].includes(item.name.toLowerCase()))) {
          department = "X-ray";
        } else if (items.some(item => item.type === "test")) {
          department = "Laboratory";
        } else if (items.some(item => item.type === "doctor-fee")) {
          department = "Consultation";
        } else {
          return res.status(400).json({ message: "Invalid item type" });
        }
    
        // **Calculate total amount**
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
        // **Create new billing entry**
        const newBilling = new Billing({
          patientId,
          department,
          items,
          totalAmount,
          status: "pending"
        });
    
        await newBilling.save();
        res.status(201).json({ message: "Billing created successfully!", billing: newBilling });
    
      } catch (error) {
        res.status(500).json({ message: "Error creating billing", error: error.message });
      }
    });

// **2. Fetch all pending bills**
router.get("/pending", async (req, res) => {
  try {
    const pendingBills = await Billing.find({ status: "pending" }).populate("patientId");
    res.json({ pendingBills });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending bills", error: error.message });
  }
});

// **3. Update billing status to "paid"**
router.put("/update/:billingId", async (req, res) => {
  try {
    const { billingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(billingId)) {
      return res.status(400).json({ message: "Invalid billing ID" });
    }

    const updatedBilling = await Billing.findByIdAndUpdate(
      billingId,
      { status: "paid" },
      { new: true } // Return the updated document
    );

    if (!updatedBilling) {
      return res.status(404).json({ message: "Billing record not found" });
    }

    res.json({ message: "Billing status updated to paid", billing: updatedBilling });
  } catch (error) {
    res.status(500).json({ message: "Error updating billing status", error: error.message });
  }
});

// **4. Get a patient's billing history**
router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }

    const patientBills = await Billing.find({ patientId }).populate("patientId");

    res.json({ patientBills });
  } catch (error) {
    res.status(500).json({ message: "Error fetching billing history", error: error.message });
  }
});

module.exports = router;
