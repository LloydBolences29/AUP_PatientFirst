// mongodb+srv://2051068:hindikoalam@29@cluster0.9whxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db.js");
const itemModel = require("./model/Item.js");
const cors = require("cors");
const patientModel = require("./model/Patient.js");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

//API fetching for the Item Model
app.get("/", async (req, res) => {
  const response = await itemModel.find();
  return res.json({ items: response });
});

//API fetching for the patient model
app.get("/patientname", async (req, res) => {
  const response = await patientModel.find();
  return res.json({ patientname: response });
});

//Add new patient
app.post("/patientname", async (req, res) => {
  try {
    const { patientID, name } = req.body; // Extract fields

    // Validate input
    if (!patientID || !name) {
      return res.status(400).json({ message: "Patient ID and name are required" });
    }

    // 1️⃣ Check if a patient with the same ID or name already exists
    const existingPatient = await patientModel.findOne({ 
      $or: [{ patientID }, { name }] 
    });

    if (existingPatient) {
      // Notify about duplicity
      return res.status(400).json({ message: "Patient already exists" });
    }

    // 2️⃣ If no duplicate, create new patient
    const newPatient = new patientModel(req.body);
    await newPatient.save();
    
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ message: "Error adding patient", error });
  }
});

// PUT - Update patient by ID
app.put("/patientname/:id", async (req, res) => {
  try {
    const updatedPatient = await patientModel.findOneAndUpdate(
      { patientID: req.params.id }, // Find by patientID
      req.body,
      { new: true } // Return the updated patient
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: "Error updating patient", error });
  }
});

// DELETE - Remove patient by ID
app.delete("/patientname/:id", async (req, res) => {
  try {
    const deletedPatient = await patientModel.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patient", error });
  }
});

//run the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
