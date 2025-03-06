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


//run the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
