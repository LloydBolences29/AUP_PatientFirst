const express = require("express");
const router = express.Router();
const { getSymptoms, getDiagnosis, getTriage } = require("../utils/infermedica");

// Route to fetch symptoms
router.get("/symptoms", async (req, res) => {
  try {
    const age = req.query.age ? parseInt(req.query.age, 10) : null;
    const ageUnit = req.query.ageUnit || "year"; // Defaults to 'year'
    const sex = req.query.sex;

    // 🔍 Log received values
    console.log("Received age:", age);
    console.log("Received age unit:", ageUnit);
    console.log("Received sex:", sex);

    if (!age || !sex) {
      return res
        .status(400)
        .json({ error: "Age, age unit, and sex are required" });
    }

    const symptoms = await getSymptoms(age, ageUnit, sex);
    res.json(symptoms);
  } catch (error) {
    console.error(
      "Error fetching symptoms:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch symptoms" });
  }
});

router.post("/diagnose", async (req, res) => {
  try {
    console.log("Received request body:", JSON.stringify(req.body, null, 2)); // Pretty-print the JSON body

    const { evidence, age, sex } = req.body;
    console.log("Received sex:", sex);
    console.log("Received age:", age);
    console.log("Received evidence:", evidence);

    if (!evidence || !age || !sex) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Call the function that communicates with the external API (Infermedica)
    const diagnosis = await getDiagnosis(evidence, age, sex);
    console.log("Diagnosis received:", diagnosis);

    res.json(diagnosis);
  } catch (error) {
    console.error("Diagnosis Error:", error.stack || error.response?.data || error.message || error);
    res
      .status(500)
      .json({
        error: error.response?.data || error.message || "Diagnosis failed",
      });
  }
});

router.post("/triage", async (req, res) => {
  try {
    const { symptoms, age, sex } = req.body;
    if (!symptoms || !age || !sex) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const triageResult = await getTriage(symptoms, age, sex);
    res.json(triageResult);
  } catch (error) {
    console.error(
      "Triage Error:",
      error.response?.data || error.message || error
    );
    res
      .status(500)
      .json({
        error: error.response?.data || error.message || "Triage failed",
      });
  }
});

router.get("/symptom/search", async (req, res) => {
  try {
    const query = req.query.q || ""; // Get search query

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Fetch all symptoms from Infermedica API
    const symptoms = await getSymptoms(30, "year", "male"); // Dummy values

    // Filter symptoms that match the search query
    const filteredSymptoms = symptoms.filter((symptom) =>
      symptom.name.toLowerCase().includes(query.toLowerCase()) ||
      symptom.common_name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 30); // Limit to 30 results

    res.json(filteredSymptoms);
  } catch (error) {
    console.error("Error searching symptoms:", error);
    res.status(500).json({ error: "Server error while searching symptoms" });
  }
});

module.exports = router;
