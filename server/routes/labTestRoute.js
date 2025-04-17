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

    router.get("/getLabTest/:category", async (req, res) => {
        const { category } = req.params;
        console.log("Category received:", category); // Add this log

        try{
            const test = await LabTest.find({ category: { $regex: new RegExp(category, 'i') } });
            
            if (!test) {
                return res.status(404).json({ message: "Lab test category not found" });
            }

            res.status(200).json(test);
        } catch (error) {
            console.error("Error fetching lab test data:", error);
            res.status(500).json({ message: "Error fetching lab test data", error });
        }
    })

module.exports = router;