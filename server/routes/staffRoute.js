const { Router } = require("express");
const router = Router();
const loginStaffController = require("../controllers/loginStaffControllers.js");
const authMiddleware = require("../middlewares/authMiddleware");


//this is the authentication routes
router.post("/login", loginStaffController.loginStaff);

module.exports = router;
