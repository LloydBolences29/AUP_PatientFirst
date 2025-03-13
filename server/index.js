// mongodb+srv://2051068:hindikoalam@29@cluster0.9whxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//load the env file path
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db.js");
const itemModel = require("./model/Item.js");
const cors = require("cors");
const patientRoutes = require("./routes/patient-data");
const cookieParser = require("cookie-parser");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const protectedRoutes = require("./routes/protectedRoutes");
//initialize the user.js file
const userRoutes = require("./routes/user-data");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Routes
//patient Routes
app.use("/patientname", patientRoutes);
connectDB();
app.use("/user", userRoutes);
app.use("/api/auth", authMiddleware)
app.use("/api/role", roleMiddleware)
app.use("/protected", protectedRoutes)

//cookie parser
app.use(cookieParser());


//API fetching for the Item Model
app.get("/", async (req, res) => {
  const response = await itemModel.find();
  return res.json({ items: response });
});

//run the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
