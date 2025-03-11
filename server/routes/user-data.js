const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authControllers");
const User = require("../model/User.js");

router.post('/signup', authController.signup);
    router.post('/login', authController.login);

module.exports = router;