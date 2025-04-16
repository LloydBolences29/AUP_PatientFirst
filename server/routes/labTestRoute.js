const {Router} = require("express");
const router = Router();
const LabTest = require("../model/labTest"); // Import the LabTest model


router.get("/getLabTest", async (req, res) => {
    try {
        const labTests = await LabTest.find();
        res.status(200).json(labTests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching lab test data", error });
    }
});

module.exports = router;