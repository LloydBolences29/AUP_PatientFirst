const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose")
const visitController = require("../controllers/visitController")
const Visit = require ("../model/VisitTable")

router.post("/create-visit", visitController.createVisit)

router.get("/fetchVisit/:patient_id", async (req, res) =>{
    try {
        const { patient_id } = req.params;
    
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(patient_id)) {
          return res.status(400).json({ message: "Invalid patient ID format." });
        }
    
        // 🔎 Find visits for the given patient_id and return vital signs
        const visits = await Visit.find({ patient_id })
          .select("visit_date blood_pressure temperature pulse_rate respiratory_rate weight last_menstrual_period chiefComplaints")
          .sort({ visit_date: -1 }); // Sort by latest visit
    
        if (!visits.length) {
          return res.status(404).json({ message: "No visits found for this patient." });
        }
    
        res.json({ visits });
      } catch (error) {
        console.error("❌ Error fetching patient visits:", error);
        res.status(500).json({ message: "Error fetching patient visits", error: error.message });
      }
})

router.get("/fetchVisits/:patientId", async (req,res) =>{
//get patient visit data
try {
  const { patientId } = req.params;

  const visits = await Visit.find()
    .populate({
      path: 'patient_id',
      match: { patient_id: patientId } // 👈 Match the *custom* patient_id in Patient model
    })
  
    console.log("Visit value: ", visits)

  const filteredVisits = visits.filter(visit => visit.patientId !== null);

  if (filteredVisits.length === 0) {
    return res.status(404).json({ message: 'No visits found for this patient ID.' });
  }

  res.status(200).json(filteredVisits);
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ message: 'Server error.' });
}
});




module.exports = router