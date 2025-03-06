// mongodb+srv://2051068:hindikoalam@29@cluster0.9whxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require("express");
const mongoose = require('mongoose')
const connectDB = require("./db.js");
const itemModel = require("./model/Item.js");
const cors = require("cors");
const patientModel = require("./model/Patient.js")


const app = express();
app.use(cors());
app.use(express.json());


connectDB();


//API fetching for the Item Model
app.get("/",  async  (req, res) => {
  const response = await itemModel.find();
  return res.json({items : response});
});

//API fetching for the patient model
app.get("/patientname", async (req, res) => {
  const response = await patientModel.find();
  return res.json({ patientname: response });
  }); 


  app.post("/patientname", async (req, res) => {
    try {
        const newPatient = new patientModel(req.body); // Save to MongoDB
        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ message: "Error adding patient", error });
    }
});


//run the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
