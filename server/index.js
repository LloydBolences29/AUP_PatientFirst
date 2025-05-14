// Load environment variables
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const fs = require("fs");
const https = require("https");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { initializeSocket } = require("./sockets/sockets.js");


const patientRoutes = require("./routes/patient-data");
const protectedRoutes = require("./routes/protectedRoutes");
const userRoles = require("./routes/roles-data");
const userRoutes = require("./routes/user-data");
const staffRoute = require("./routes/staffRoute.js");
const authRoute = require("./routes/auth.js");
const medicationRoute = require("./routes/pharma-route.js")
const visitRoute = require("./routes/visitTable.js")
const mroRoutes = require("./routes/mro-route")
const typeOfVisitReportRoute = require ("./routes/typeOfPatientVisitReport.js")
const doctorRoutes = require ("./routes/doctorRoutes.js")
const icdRoutes = require("./routes/icdCode.js")
const checkUpRoutes = require ("./routes/checkupRoutes.js")
const prescriptionRoutes = require("./routes/prescriptionRoutes.js")
const infermedicaRoutes = require("./routes/infermedica.js")
const billingRoutes = require("./routes/BillingRoutes.js")
const xrayRoutes = require("./routes/xrayRoutes.js")
const labTestRoute = require("./routes/labTestRoute.js") // Import the lab test route
const queueRoute = require("./routes/queueRoute.js") // Import the queue route
const patientTypeCount = require("./routes/patientTypeCount.js")
const mostDiagnosed = require("./routes/mostDiagnosed.js")
const FormRequest = require("./routes/formRequest.js"); // Import the form request route



const app = express();



// ✅ Connect to MongoDB BEFORE initializing routes
connectDB();
const privateKey = fs.readFileSync("server.key", "utf8");
const certificate = fs.readFileSync("server.cert", "utf8");
const credentials = { key: privateKey, cert: certificate };


const server = https.createServer(credentials, app);

// ✅ Middleware Setup
app.use(cors({
  origin: ["https://localhost:5173", "https://localhost:3000"], // Ensure HTTP, not HTTPS
  methods: ["GET", "POST", "PUT","OPTIONS", "PATCH"], // Explicitly allow POST requests
  allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  credentials: true // Allow cookies & authentication headers
}));


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
app.use("/patient-visit", visitRoute) // for recording the vital signs of the patient every visit
app.use("/mro", mroRoutes) // Routes for MRO
app.use("/type-of-visit-report", typeOfVisitReportRoute) // routes for getting the analytics for every type of patient visit
app.use("/doctor", doctorRoutes)
app.use("/icd", icdRoutes) //For icd 10 code routes
app.use("/checkup", checkUpRoutes) // for checkup routes
app.use("/prescriptions", prescriptionRoutes) //Routes for the prescription HTTP Methods
app.use("/infermedica-api", infermedicaRoutes) //For AI infermedica ROutes
app.use("/billing", billingRoutes) //For billing routes
app.use("/xray", xrayRoutes) //For xray routes
app.use("/labTest", labTestRoute) //For lab test routes
app.use("/queue", queueRoute) //For queue routes
app.use("/patientTypeCountReport", patientTypeCount) // for counting the number of in patient, out patient or emergency patient
app.use("/getDiagnose", mostDiagnosed)// analytics for most diagnosed sickness\
app.use("/formRequest", FormRequest); // for form request routes



initializeSocket(server);

// app.use(express.json({ limit: "1mb" })); // Increase limit to 1MB
// app.use(express.urlencoded({ extended: true, limit: "1mb" })); 
//for testing the HTTPS
app.get("/", (req, res) => {
  res.send("✅ HTTPS is working!");
});




// ✅ Start the Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
