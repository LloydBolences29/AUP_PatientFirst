const { Router } = require("express");
const router = Router();
const visitController = require("../controllers/visitController")

router.post("/create-visit", visitController.createVisit)

module.exports = router