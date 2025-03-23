const Visit = require("../model/VisitTable");
const Patient = require("../model/Patient")

const getPatientData = async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate(
        "patient_id"
      ) // Fetch patient details
    //   .sort({ visit_date: -1 }); // Sort by latest visits first

    res.status(200).json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {getPatientData}