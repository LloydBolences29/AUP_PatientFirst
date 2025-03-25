const express = require ("express")
const router = express.Router()
const typeOfVisit = require("../controllers/typeOfPatientVisit")


router.get("/checkUpPatientperMonth/count", typeOfVisit.typeOfVisit)

module.exports = router