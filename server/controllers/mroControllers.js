const Visit = require("../model/VisitTable");
const Patient = require("../model/Patient");
const Checkup = require("../model/checkup");

const getPatientData = async (req, res) => {
  try {
    const visits = await Visit.find().populate("patient_id"); // Fetch patient details
    //   .sort({ visit_date: -1 }); // Sort by latest visits first

    res.status(200).json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const fetchPatientData = async (req, res) => {
  const query = req.query.query; // Get the search query from the request
  try {
    let filter = {};

    if (query) {
      // Case-insensitive partial match for name or exact patient_id
      filter = {
        $or: [
          { firstname: { $regex: query, $options: "i" } },
          { lastname: { $regex: query, $options: "i" } },
          { patient_id: query }, // Exact match for ID
        ],
      };
    }

    const response = await Patient.find(filter);
    return res.status(200).json(response); // <-- Just return the array here!
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkups = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log("Searching for patientId:", patientId);

    const visits = await Checkup.find().populate({
      path: "visitId",
      match: { "patient_id.patient_id": patientId }, // Match the patientId in the visitId
    });
    const filteredVisits = visits.filter((v) => v.visitId !== null);
    console.log(filteredVisits);

    res.json(visits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch visits" });
  }
}; // Get the search query from the request

module.exports = { getPatientData, fetchPatientData, checkups };
