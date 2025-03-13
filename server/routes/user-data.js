const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authControllers");
console.log("authController", authController);
const User = require("../model/User.js");


//this is the authentication routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
