const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authControllers");
console.log("authController", authController);
const User = require("../model/User.js");
const authMiddleware = require("../middlewares/authMiddleware");


//this is the authentication routes
router.post("/add-patient", authMiddleware, authController.addPatient);
router.post("/login", authMiddleware, authController.login);

module.exports = router;
