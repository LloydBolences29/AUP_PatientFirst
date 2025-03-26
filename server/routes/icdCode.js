const { Router } = require("express");
const router = Router();
const ICD = require("../model/icdcode")

// API Route to Get All ICD-10 Codes
router.get("/icd10", async (req, res) => {
    try {
      const icdCodes = await ICD.find();
      res.json(icdCodes);
    } catch (error) {
      res.status(500).json({ error: "Server error while fetching ICD codes" });
    }
  });
  
  // API Route to Get ICD by Code
  router.get("/icd10/search", async (req, res) => {
    try {
        const query = req.query.q || ""; // Get search query
        const icdCodes = await ICD.find({
          $or: [
            { code: { $regex: `^${query}`, $options: "i" } }, // Search in code
            { shortdescription: { $regex: `^${query}`, $options: "i" } }, // Search in short description
          ],
        }).limit(50); // Limit results to 50
    
        res.json(icdCodes);
      } catch (error) {
        res.status(500).json({ error: "Server error while searching ICD codes" });
      }
    });

  module.exports = router