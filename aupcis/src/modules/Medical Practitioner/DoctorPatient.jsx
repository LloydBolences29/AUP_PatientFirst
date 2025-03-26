import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Modal from "../../components/Modal";

const DoctorPatient = () => {
  const doctorSidebarLinks = [
    { label: "Dashboard", path: "/nurse-dashboard" },
    { label: "Patient Queue", path: "/doctor-patient-management" },
  ];

  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [icdQuery, setIcdQuery] = useState("");
  const [icdResults, setIcdResults] = useState([]);
  const [selectedICD, setSelectedICD] = useState(null);
  const [doctorNote, setDoctorNote] = useState(""); // New state for doctor's note

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await fetch("http://localhost:3000/doctor/get-patients");
      if (!response.ok) throw new Error("Failed to fetch visits");
      const data = await response.json();
      setVisits(data);
    } catch (error) {
      console.error("Error fetching visits:", error);
    }
  };

  const fetchICDCodes = async (query) => {
    try {
      if (query.length < 3) {
        setIcdResults([]);
        return;
      }
      const response = await fetch(
        `http://localhost:3000/icd/icd10/search?q=${query}`
      );
      const data = await response.json();
      console.log("ICD-10 Search Results:", data); // Debugging
      setIcdResults(data);
    } catch (error) {
      console.error("Error fetching ICD codes:", error);
    }
  };

  const handleRowClick = (visit) => {
    setSelectedVisit(visit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVisit(null);
    setSelectedICD(null);
  };

  // 🟢 Handle ICD-10 Search
  const handleICDSearch = async (e) => {
    const query = e.target.value;
    setIcdQuery(query);

    if (query.length > 1) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/icd/search?q=${query}`
        );
        setIcdResults(response.data); // Assume response returns [{ code, shortdescription }]
      } catch (error) {
        console.error("Error fetching ICD-10 codes:", error);
      }
    } else {
      setIcdResults([]); // Clear results when query is too short
    }
  };

  const handleICDSelect = (icd) => {
    if (!selectedICD.some((selected) => selected.code === icd.code)) {
      setSelectedICDs([...selectedICD, icd]); // Add new ICD code
    }
    setIcdQuery(""); // Clear search input
    setIcdResults([]); // Hide search results
  };

  const handleICDRemove = (icd) => {
    setSelectedICDs(selectedICD.filter((item) => item.code !== icd.code));
  };

  // 🟢 Submit Selected ICDs with Form Data
  const handleSubmit = async () => {
    try {
      const visitData = {
        patientId: selectedPatientId,
        icd: selectedICD.map((icd) => icd.code), // Send array of ICD codes
      };

      await axios.post("http://localhost:3000/checkup", visitData);
      alert("Visit recorded successfully!");
      setSelectedICDs([]); // Reset selected ICDs
    } catch (error) {
      console.error("Error submitting visit:", error);
    }
  };

  const handleCompleteVisit = async (visitId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/doctor/visits/${visitId}/complete`,
        { method: "PUT" }
      );

      if (!response.ok) throw new Error("Failed to complete visit");

      // Remove completed visit from state
      setVisits((prevVisits) =>
        prevVisits.filter((visit) => visit._id !== visitId)
      );

      alert("Visit marked as completed!");
    } catch (error) {
      console.error("Error completing visit:", error);
    }
  };

  const handleNoteChange = (e) => {
    setDoctorNote(e.target.value);
  };

  return (
    <div>
      <Sidebar
        links={doctorSidebarLinks}
        pageContent={
          <div>
            <h2>Visits</h2>
            <table className="table table-striped table-bordered mx-3">
              <thead className="thead-dark">
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visits.length > 0 ? (
                  visits.map((visit) => (
                    <tr key={visit._id} style={{ cursor: "default" }}>
                      <td>{visit.patient_id?.patient_id}</td>
                      <td>
                        {visit.patient_id
                          ? `${visit.patient_id.firstname} ${visit.patient_id.lastname}`
                          : "Unknown Patient"}
                      </td>
                      <td>{visit.status}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(visit); // Open modal when button is clicked
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No visits found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Modal
              show={isModalOpen}
              body={
                <>
                  <div
                    className="modal-content"
                    style={{
                      width: "85%",
                      height: "85%",
                      margin: "50px 100px",
                      position: "fixed",
                      top: "0px",
                      left: "0px",
                      overflowY: "auto", // Enable vertical scrolling
                    }}
                  >
                    <div className="modal-header">
                      <h3 className="modal-title">Visit Details</h3>
                    </div>
                    <div className="modal-body">
                      {selectedVisit && (
                        <>
                          <div style={{ display: "flex" }}>
                            <div className="selectedPatient-name-ID">
                              <div>
                                <div>
                                  <h1>
                                    {selectedVisit.patient_id?.firstname}{" "}
                                    {selectedVisit.patient_id?.lastname}
                                  </h1>
                                </div>
                                <div style={{ display: "flex" }}>
                                  <div>
                                    <p>
                                      {selectedVisit.patient_id?.patient_id}
                                    </p>
                                  </div>
                                  <div style={{ margin: "0 10px" }}>
                                    <p> {selectedVisit.patient_id?.gender}</p>
                                  </div>
                                  <div style={{ margin: "0 10px" }}>
                                    <p> {selectedVisit.patient_id?.age}</p>
                                  </div>
                                  <div style={{ margin: "0 10px" }}>
                                    <p>
                                      {new Date(
                                        selectedVisit.patient_id?.dob
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div style={{ margin: "0 10px" }}>
                                    <p>For: {selectedVisit.purpose}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className="for-vital-signs"
                              style={{ margin: "5px", display: "flex" }}
                            >
                              <div style={{ margin: "0 10px" }}>
                                <p>
                                  <strong>BP: </strong>
                                  {selectedVisit.blood_pressure}
                                </p>
                                <p>
                                  <strong>Temp:</strong>{" "}
                                  {selectedVisit.temperature}
                                </p>
                              </div>
                              <div style={{ margin: "0 10px" }}>
                                <p>
                                  <strong>RR:</strong>{" "}
                                  {selectedVisit.respiratory_rate}
                                </p>
                                <p>
                                  <strong>PR:</strong>{" "}
                                  {selectedVisit.temperature} in C
                                </p>
                              </div>
                              <div style={{ margin: "0 10px" }}>
                                <p>
                                  <strong>Weight:</strong>{" "}
                                  {selectedVisit.weight} in kg
                                </p>
                                <p>
                                  <strong>Allergies:</strong>
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="details-for-doctors">
                            <div
                              className="details-for-doctors-wrapper"
                              style={{ backgroundColor: "whitesmoke" }}
                            >
                              <div
                                className="details-for-doctors-content"
                                style={{ padding: "10px" }}
                              >
                                <p>
                                  <strong>Chief Complaints:</strong> "
                                  {selectedVisit.chiefComplaints}""
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Add more details as needed */}

                          {/* 🔍 ICD-10 SEARCH BAR */}
                          <div>
                            <label>
                              <strong>Diagnosis (ICD-10):</strong>
                            </label>
                            <input
                              type="text"
                              value={icdQuery}
                              onChange={handleICDSearch}
                              placeholder="Search ICD-10 codes..."
                              className="form-control"
                            />

                            {/* ICD-10 Search Results */}
                            {icdResults.length > 0 && (
                              <ul
                                className="list-group"
                                style={{
                                  maxHeight: "150px",
                                  overflowY: "scroll",
                                  cursor: "pointer",
                                }}
                              >
                                {icdResults.map((icd) => (
                                  <li
                                    key={icd.code}
                                    className="list-group-item"
                                    onClick={() => handleICDSelect(icd)}
                                  >
                                    {icd.code} - {icd.shortdescription}
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Selected ICD-10 Codes */}
                            {selectedICD.length > 0 && (
                              <div className="mt-2">
                                <strong>Selected Diagnoses:</strong>
                                <div className="d-flex flex-wrap">
                                  {selectedICD.map((icd) => (
                                    <span
                                      key={icd.code}
                                      className="badge bg-primary m-1"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleICDRemove(icd)}
                                    >
                                      {icd.code} - {icd.shortdescription} ✖
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {selectedICD && (
                            <p>
                              <strong>Selected ICD Code:</strong>{" "}
                              {selectedICD.code} -{" "}
                              {selectedICD.shortdescription}
                            </p>
                          )}

                          <div>
                            <label>
                              <strong>Doctor's Note:</strong>
                            </label>
                            <textarea
                              value={doctorNote}
                              onChange={handleNoteChange}
                              placeholder="Add additional notes here..."
                              className="form-control"
                              rows="4"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to mark this visit as complete?"
                            )
                          ) {
                            handleCompleteVisit(selectedVisit._id);
                            closeModal();
                          }
                        }}
                      >
                        Mark as Complete
                      </button>
                    </div>
                  </div>
                </>
              }
            />
          </div>
        }
      />
    </div>
  );
};

export default DoctorPatient;
