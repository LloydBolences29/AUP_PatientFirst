const express  = require("express")
const router = express.Router()
const infermedicaController = require("../controllers/infermedicaController")

router.get("/get-patient/:patient_id", infermedicaController.get_infermedica)
router.post("/create-patient", infermedicaController.post_infermedica)
router.post("/analyze-symptoms", infermedicaController.analyzeSymptom)

module.exports =router