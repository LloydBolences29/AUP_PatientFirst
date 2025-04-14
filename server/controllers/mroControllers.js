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
    const { searchValue } = req.params; // This can be patient_id, firstname, or lastname
    console.log("Searching for:", searchValue);

    const checkups = await Checkup.find()
    .populate({
      path: 'visitId',
      populate: {
        path: 'patient_id',
        // select: 'firstname lastname patient_id'
      }
    })
    .populate("icd", "code shortdescription"); // Populate ICD-10 details

    const filteredCheckups = checkups.filter((checkup) => {
      const patient = checkup?.visitId?.patient_id;
      if (!patient) return false;
    
      const search = searchValue.toLowerCase().trim();
      return (
        String(patient.patient_id).toLowerCase().trim() === search ||
        patient.firstname.toLowerCase().includes(search) ||
        patient.lastname.toLowerCase().includes(search)
      );
    });
    
    checkups.forEach((checkup, i) => {
      const patient = checkup?.visitId?.patient_id;
      console.log(`Checkup ${i}:`, {
        patient_id: patient?.patient_id,
        firstname: patient?.firstname,
        lastname: patient?.lastname
      });
    });
    


    res.json(filteredCheckups);
  } catch (error) {
    console.error("Error fetching checkups:", error);
    res.status(500).json({ error: "Failed to fetch checkups" });
  }
};



module.exports = { getPatientData, fetchPatientData, checkups };
