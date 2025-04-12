const express = require("express")
const router = express.Router()
const mroController = require("../controllers/mroControllers")

//get patient data 
router.get("/patient-data", mroController.getPatientData )
//get all patients
router.get("/patients", mroController.fetchPatientData)
router.get("/checkups/:patientId", mroController.checkups)

module.exports = router