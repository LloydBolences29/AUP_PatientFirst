const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Define access control for each role
const accessControl = {
    Patient: ["dashboard", "analytics", "profile"],
    Admin: ["admin-dashboard", "admin-management", "admin-analytics"],
    Nurse: ["nurse-dashboard", "patient-management", "nurse-analytics"],
    Doctor: ["doctor-dashboard", "doctor-analytics"],
    Cashier: ["cashier-dashboard", "payment"],
    Pharmacy: ["pharma-dashboard", "medicines"]
};

// 🔹 Admin Routes (Only accessible to Admins)
router.get("/admin/dashboard", authMiddleware, roleMiddleware("Admin"), (req, res) => {
    res.json({ message: "Welcome to the Admin Dashboard!" });
});

router.get("/admin/management", authMiddleware, roleMiddleware("Admin"), (req, res) => {
    res.json({ message: "Admin Management Page" });
});

// 🔹 Patient Routes
router.get("/patient/dashboard", authMiddleware, roleMiddleware("Patient"), (req, res) => {
    res.json({ message: "Welcome to the Patient Dashboard!" });
});

router.get("/patient/analytics", authMiddleware, roleMiddleware("Patient"), (req, res) => {
    res.json({ message: "Patient Analytics Page" });
});

// 🔹 Doctor Routes
router.get("/doctor/dashboard", authMiddleware, roleMiddleware("Doctor"), (req, res) => {
    res.json({ message: "Welcome to the Doctor Dashboard!" });
});

// 🔹 Nurse Routes
router.get("/nurse/dashboard", authMiddleware, roleMiddleware("Nurse"), (req, res) => {
    res.json({ message: "Welcome to the Nurse Dashboard!" });
});

// 🔹 Cashier Routes
router.get("/cashier/dashboard", authMiddleware, roleMiddleware("Cashier"), (req, res) => {
    res.json({ message: "Welcome to the Cashier Dashboard!" });
});

// 🔹 Pharmacy Routes
router.get("/pharmacy/dashboard", authMiddleware, roleMiddleware("Pharmacy"), (req, res) => {
    res.json({ message: "Welcome to the Pharmacy Dashboard!" });
});

module.exports = router;
