// Load environment variables
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const patientRoutes = require("./routes/patient-data");
const protectedRoutes = require("./routes/protectedRoutes");
const userRoles = require("./routes/roles-data");
const userRoutes = require("./routes/user-data");
const staffRoute = require("./routes/staffRoute.js");
const authRoute = require("./routes/auth.js");
const medicationRoute = require("./routes/pharma-route.js")

const app = express();

// ✅ Connect to MongoDB BEFORE initializing routes
connectDB();

// ✅ Middleware Setup
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, // Allow cookies to be sent
},
{ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ Routes Setup
app.use("/api/auth", authRoute); // Authentication routes
app.use("/api", protectedRoutes); // Role-based protected routes
app.use("/api/roles", userRoles); // Getting staff information and saving it to DB
app.use("/staff", staffRoute); // Staff login API
app.use("/patient", userRoutes); // add patient and login route for patient
app.use("/patientname", patientRoutes); // fetch, add, update and delete route for patient
app.use("/api/pharma", medicationRoute) // fetch, add, update and delete medication and stock



// ✅ API for Fetching Items
app.get("/", async (req, res) => {
  const response = await itemModel.find();
  return res.json({ items: response });
});

// ✅ Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});