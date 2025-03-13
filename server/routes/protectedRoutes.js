const express = require("express");
const  authMiddleware  = require("../middlewares/authMiddleware");
const  roleMiddleware  = require("../middlewares/roleMiddleware");

const router = express.Router();

// router.get("/protected-data", authMiddleware, (req, res) => {
//   res.json({ message: "You have access!", user: req.user });
// });

// Role-based access control
//this is for the proteced routes
const accessControl = {
  patient: ["dashboard", "analytics", "profile"],
  admin: ["admin-dashboard", "admin-management", "admin-analytics"],
  nurse: ["nurse-dashboard", "patient-management", "nurse-analytics"],
  doctor: ["doctor-dashboard", "doctor-analytics"],
  cashier: ["cashier-dashboard", "payment"],
  pharmacy: ["pharma-dashboard", "medicines"],
};

// Generic route handler using roleMiddleware dynamically
const dynamicRoleMiddleware = (req, res, next) => {
  const { page } = req.params;
  const role = req?.user?.role; // Ensure req.user is available

  if (!role) {
    return res.status(403).json({ message: "User role not found. Access denied." });
  }

  const allowedPages = accessControl[role] || [];

  if (!allowedPages.includes(page)) {
    return res.status(403).json({ message: "Access denied. You do not have permission to view this page." });
  }

  next();
};

// Apply both middlewares
router.get("/:page", authMiddleware, dynamicRoleMiddleware, (req, res) => {
  res.json({ message: `You have access to ${req.params.page}`, user: req.user });
});

module.exports = router;