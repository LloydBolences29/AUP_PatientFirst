const {Router} = require("express");
const router = Router();
const Xray = require("../model/xrayModel"); // Import the X-ray model

router.get("/getXray", async (req, res) => {
    try {
        const xray = await Xray.find();
        res.status(200).json(xray);
    } catch (error) {
        res.status(500).json({ message: "Error fetching xray data", error });
    }
});

// Get xray by Procedure name
router.get("/getXray/:category", async (req, res) => {
    const { category } = req.params;
    console.log("Category received:", category); // Add this log


    try {
        // Find the category by name and return all its procedures
        const xray = await Xray.findOne({ Category: { $regex: new RegExp(category, 'i') } });

        if (!xray) {
            return res.status(404).json({ message: "X-ray category not found" });
        }

        // Return the category and the list of procedures under that category
        res.status(200).json({
            Category: xray.Category,
            Procedures: xray.Procedures
        });
    } catch (error) {
        console.error("Error fetching X-ray data:", error);
        res.status(500).json({ message: "Error fetching X-ray data", error });
    }
});


module.exports = router;