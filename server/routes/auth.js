const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const  { loginStaff } = require( "../controllers/loginStaffControllers");
// ✅ GET LOGGED-IN USER DETAILS
router.get("/me", authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const role = req.user.role; // Get role from decoded JWT
  const accessControl = {
    Patient: ["/dashboard", "/analytics", "/profile"],
    Admin: ["/admin-dashboard", "/admin-management", "/admin-analytics"],
    MedicalRecordsOfficer: ["/medicalRecord-dashboard", "/medicalRecord-management"],
    Nurse: ["/nurse-dashboard", "/patient-management", "/nurse-analytics"],
    Doctor: ["/doctor-dashboard", "/patient"],
    Cashier: ["/cashier-dashboard", "/payment"],
    Pharmacist: ["/pharma-dashboard", "/pharma-transaction", "/medicine-list"]
  };

  res.json({
    user: req.user,
    allowedPages: accessControl[role] || [],
  });
});

// ✅ LOGIN ROUTE (FIXED)
// router.post('/login', loginStaff);

module.exports = router;