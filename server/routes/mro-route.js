const express = require("express")
const router = express.Router()
const mroController = require("../controllers/mroControllers")

//get patient data 
router.get("/patient-data", mroController.getPatientData )

module.exports = router