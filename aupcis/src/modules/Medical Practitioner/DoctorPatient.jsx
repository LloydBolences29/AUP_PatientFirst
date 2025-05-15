import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import AccordionComponents from "../../components/AccordionComponents";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardFooter,
} from "react-bootstrap";
import Modal from "../../components/Modal";

const DoctorPatient = () => {
  const doctorSidebarLinks = [
    { label: "Dashboard", path: "/doctor-dashboard" },
    { label: "Patient", path: "/doctor-patient-management" },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [icdQuery, setIcdQuery] = useState("");
  const [icdResults, setIcdResults] = useState([]);
  const [selectedICD, setSelectedICD] = useState([]);
  const [doctorNote, setDoctorNote] = useState(""); // New state for doctor's note
  const [chiefComplaint, setChiefComplaint] = useState(""); // New state for chief complaint
  const [isEditingChiefComplaint, setIsEditingChiefComplaint] = useState(false); // New state for edit mode
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctorFee, setDoctorFee] = useState("");
  const [patientType, setPatientType] = useState("Outpatient");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [checkedValue, setCheckedValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [patientVisits, setPatientVisits] = useState([]);
  const [visitData, setVisitData] = useState([]);
  const [medCertSelections, setMedCertSelections] = useState({
    CXR: "",
    CBC: "",
    Urinalysis: "",
    DrugTest: "",
  });

  const fetchVisitData = async (patientId) => {
    try {
      const response = await fetch(
        `https://aup-patientfirst-server.onrender.com/checkup/getCertainCheckup/${patientId}`
      );
      const data = await response.json();

      console.log("Fetched checkup data:", data); // should now be filtered properly
      setVisitData(data); // assuming visitData is a state holding all the checkups
    } catch (error) {
      console.error("Error fetching visits:", error.message);
    }
  };

  const handleCheckBoxChange = (e) => {
    setIsChecked(e.target.checked);
    setTextValue(e.target.value);
    console.log("Checked Item is : ", e.target.value);
    //get the value of the checked box
    setCheckedValue(e.target.value);
  };

  const handleMedCertSubmit = () => {
    console.log("Submitted text:", textValue);
    alert("Successfully Submitted");
    setIsModalOpen(false);
    // You can also send `inputValue` to your backend or process it however you like
  };

  const addPrescription = (type) => {
    setPrescriptions((prevPrescriptions) => [
      ...prevPrescriptions.filter((pres) => pres.type === type),
      type === "medicinal"
        ? {
            type: "medicinal",
            medication: "",
            dosage: "",
            frequency: "",
            duration: "",
          }
        : {
            type: "non-medicinal",
            recommendation: "",
            notes: "",
          },
    ]);
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await fetch(
        "https://aup-patientfirst-server.onrender.com/doctor/get-patients"
      );
      if (!response.ok) throw new Error("Failed to fetch visits");
      const data = await response.json();
      console.log("Fetched visits:", data);
      setVisits(data);
    } catch (error) {
      console.error("Error fetching visits:", error);
    }
  };

  const handleRowClick = async (visit) => {
    setSelectedVisit(visit); // Save the visit object
    setChiefComplaint(visit.chiefComplaints || "");
    setIsModalOpen(true);

    // Extract the patient_id from the visit object
    const patientId = visit.visitId?._id || visit.patient_id;

    if (patientId) {
      await fetchVisitData(patientId); // This gets all checkups linked to this patient
      console.log("Fetched checkups for patient ID:", patientId);
    } else {
      console.warn("No patient ID found in visit object");
    }
  };

  const handleOpenModal = (purpose) => {
    setSelectedPurpose(purpose);
    setShowModal(true);
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
          `https://aup-patientfirst-server.onrender.com/icd/icd10/search?q=${query}`
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
    if (!selectedICD?.some((selected) => selected.code === icd.code)) {
      setSelectedICD([...selectedICD, icd]); // Add new ICD code
    }
    setIcdQuery(""); // Clear search input
    setIcdResults([]); // Hide search results
  };

  const handleICDRemove = (icd) => {
    setSelectedICD(selectedICD.filter((item) => item.code !== icd.code));
  };

  const handleCompleteVisit = async (visitId) => {
    try {
      const response = await fetch(
        `https://aup-patientfirst-server.onrender.com/doctor/visits/${visitId}/complete`,
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

  const handleChiefComplaintChange = (e) => {
    setChiefComplaint(e.target.value);
  };

  const toggleChiefComplaintEdit = () => {
    setIsEditingChiefComplaint(!isEditingChiefComplaint);
  };
  console.log("Checkup response:", selectedVisit);

  const handleSubmitVisitDetails = async () => {
    setLoading(true);
    setMessage("");
    try {
      const checkupResponse = await axios.post(
        "https://aup-patientfirst-server.onrender.com/checkup/create-new",
        {
          visitId: selectedVisit._id,
          patientId: selectedVisit.patient_id?._id,
          icd: selectedICD.map((icd) => icd._id),
          additionalNotes: doctorNote,
          doctorFee: parseFloat(doctorFee),
          patientType, // Include patient type in creation request
        }
      );

      const checkupId = checkupResponse.data.checkupId;

      await axios.post(
        "https://aup-patientfirst-server.onrender.com/prescriptions/createPrescription",
        {
          checkupId, // Reference the existing checkup
          patientId: selectedVisit.patient_id?._id,
          prescriptions,
        }
      );

      alert("Visit recorded successfully!");
      setSelectedICD([]); // Reset selected ICDs
      setPrescriptions([]); // Clear prescriptions
      setDoctorFee("");
      setDoctorNote(""); // Clear doctor's note
    } catch (error) {
      console.error("Error submitting visit:", error);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions]; // Copy current prescriptions
    updatedPrescriptions[index][field] = value; // Update specific field
    setPrescriptions(updatedPrescriptions); // Save updated state
  };

  const handleMedCertRadioChange = (group, value) => {
    setMedCertSelections((prev) => ({
      ...prev,
      [group]: value,
    }));
  };

  console.log("Selected Visit Data:", visitData);

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
                  <th>Purpose</th>
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
                      <td>{visit.purpose}</td>
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

            {/* this is the modal for CheckUp purposes */}

            {selectedVisit?.purpose === "Checkup" ? (
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
                                  <p>
                                    <strong>Purpose:</strong>
                                    {selectedVisit.purpose}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div>
                                <div className="details-for-doctors">
                                  <div className="details-for-doctors-wrapper">
                                    <div
                                      className="details-for-doctors-content"
                                      style={{ padding: "10px" }}
                                    >
                                      <AccordionComponents
                                        items={[
                                          {
                                            title: (
                                              <>
                                                <label>Chief Complaints:</label>
                                                <button
                                                  className="btn btn-link btn-sm"
                                                  onClick={
                                                    toggleChiefComplaintEdit
                                                  }
                                                  style={{ marginLeft: "10px" }}
                                                >
                                                  {isEditingChiefComplaint
                                                    ? "Cancel"
                                                    : "Edit"}
                                                </button>
                                              </>
                                            ),
                                            content: (
                                              <>
                                                {isEditingChiefComplaint ? (
                                                  <textarea
                                                    value={chiefComplaint}
                                                    onChange={
                                                      handleChiefComplaintChange
                                                    }
                                                    placeholder="Edit chief complaints here..."
                                                    className="form-control"
                                                    rows="3"
                                                  />
                                                ) : (
                                                  <p>
                                                    {`"${
                                                      chiefComplaint ||
                                                      "No chief complaints provided."
                                                    }"`}
                                                  </p>
                                                )}
                                              </>
                                            ),
                                          },
                                          {
                                            title: "Medical History",
                                            content: "Content 1",
                                          },
                                          {
                                            title:
                                              "Previous Consultations and Treatments",
                                            content: (
                                              <div
                                                style={{
                                                  maxHeight: "300px",
                                                  overflowY: "scroll",
                                                }}
                                              >
                                                {Array.isArray(visitData) &&
                                                visitData.length > 0 ? (
                                                  visitData.map(
                                                    (checkup, index) => (
                                                      <Card
                                                        className="mb-1 shadow-sm"
                                                        key={index}
                                                        style={{
                                                          maxWidth: "600px",
                                                          margin: "0 auto",
                                                        }}
                                                      >
                                                        <Card.Header
                                                          style={{
                                                            backgroundColor:
                                                              "#455F79",
                                                            color: "white",
                                                          }}
                                                        >
                                                          Visit Date:{" "}
                                                          {new Date(
                                                            checkup.visitId?.visit_date
                                                          ).toLocaleDateString()}
                                                        </Card.Header>
                                                        <Card.Body>
                                                          <Row>
                                                            <Col>
                                                              <p>
                                                                <strong>
                                                                  Temperature:
                                                                </strong>{" "}
                                                                {
                                                                  checkup
                                                                    .visitId
                                                                    ?.temperature
                                                                }{" "}
                                                                °C
                                                              </p>
                                                              <p>
                                                                <strong>
                                                                  RR:
                                                                </strong>{" "}
                                                                {
                                                                  checkup
                                                                    .visitId
                                                                    ?.respiratory_rate
                                                                }{" "}
                                                                breaths/min
                                                              </p>
                                                            </Col>
                                                            <Col>
                                                              <p>
                                                                <strong>
                                                                  Pulse Rate:
                                                                </strong>{" "}
                                                                {
                                                                  checkup
                                                                    .visitId
                                                                    ?.pulse_rate
                                                                }{" "}
                                                                beats/min
                                                              </p>
                                                              
                                                            </Col>

                                                            <Col>
                                                              <p>
                                                                <strong>
                                                                  Weight:
                                                                </strong>{" "}
                                                                {
                                                                  checkup
                                                                    .visitId
                                                                    ?.weight
                                                                }{" "}
                                                                Kilogram/s
                                                              </p>
                                                              <p>
                                                                <strong>
                                                                  Blood Pressure: 
                                                                </strong>{" "}
                                                                {
                                                                  checkup
                                                                    .visitId
                                                                    ?.blood_pressure
                                                                }
                                                              </p>
                                                            </Col>
                                                            <Col md={12}>
                                                            <p>
                                                                <strong>
                                                                  Chief
                                                                  Complaint:
                                                                </strong>{" "}
                                                                {
                                                                  checkup
                                                                    .visitId
                                                                    ?.chiefComplaints
                                                                }
                                                              </p>
                                                            
                                                            </Col>
                                                            <Col md={12}>
                                                              <p>
                                                                <strong>
                                                                  Diagnosis:
                                                                </strong>
                                                              </p>
                                                              {checkup.icd
                                                                ?.length > 0 ? (
                                                                <ul>
                                                                  {checkup.icd.map(
                                                                    (d, i) => (
                                                                      <li
                                                                        key={i}
                                                                      >
                                                                        {
                                                                          d.shortdescription
                                                                        }
                                                                      </li>
                                                                    )
                                                                  )}
                                                                </ul>
                                                              ) : (
                                                                <p>
                                                                  No diagnosis
                                                                  provided.
                                                                </p>
                                                              )}
                                                            </Col>
                                                            <Col md={12}>
                                                              <p>
                                                                <strong>
                                                                  Additional
                                                                  Notes:
                                                                </strong>{" "}
                                                                {checkup.additionalNotes ||
                                                                  "None"}
                                                              </p>
                                                            </Col>
                                                          </Row>
                                                        </Card.Body>
                                                      </Card>
                                                    )
                                                  )
                                                ) : (
                                                  <p>
                                                    No previous consultations or
                                                    treatments found.
                                                  </p>
                                                )}
                                              </div>
                                            ),
                                          },
                                        ]}
                                      />
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
                                  {selectedICD?.length > 0 && (
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
                                            {icd.code} - {icd.shortdescription}{" "}
                                            ✖
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="p-4 border rounded">
                                    <h3 className="text-lg font-bold">
                                      Change Patient Type
                                    </h3>
                                    {message && (
                                      <p className="text-green-600">
                                        {message}
                                      </p>
                                    )}
                                    <select
                                      value={patientType}
                                      onChange={(e) =>
                                        setPatientType(e.target.value)
                                      }
                                      className="p-2 border rounded"
                                      disabled={loading} // Disables during API call
                                    >
                                      <option value="Outpatient">
                                        Outpatient
                                      </option>
                                      <option value="Inpatient">
                                        Inpatient
                                      </option>
                                    </select>
                                    {loading && (
                                      <p className="text-blue-500">
                                        Updating...
                                      </p>
                                    )}{" "}
                                    {/* Show loading message */}
                                  </div>

                                  <Container>
                                    <h2 className="my-4">Prescription Form</h2>
                                    {prescriptions.map((pres, index) => (
                                      <Row
                                        key={index}
                                        className="prescription-entry mb-3"
                                      >
                                        {pres.type === "medicinal" ? (
                                          <>
                                            <Col md={3}>
                                              <Form.Control
                                                type="text"
                                                placeholder="Medication"
                                                value={pres.medication}
                                                onChange={(e) =>
                                                  handleChange(
                                                    index,
                                                    "medication",
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </Col>
                                            <Col md={2}>
                                              <Form.Control
                                                type="text"
                                                placeholder="Dosage"
                                                value={pres.dosage}
                                                onChange={(e) =>
                                                  handleChange(
                                                    index,
                                                    "dosage",
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </Col>

                                            <Col md={2}>
                                              <Form.Control
                                                as="textarea"
                                                placeholder="Instruction"
                                                value={pres.instruction}
                                                onChange={(e) =>
                                                  handleChange(
                                                    index,
                                                    "instruction",
                                                    e.target.value
                                                  )
                                                }
                                                rows={3} // Optional: Adjust the number of rows
                                                style={{ resize: "horizontal" }} // Allow horizontal resizing
                                              />
                                            </Col>
                                          </>
                                        ) : (
                                          <>
                                            <Col md={6}>
                                              <Form.Control
                                                type="text"
                                                placeholder="Recommendation"
                                                value={pres.recommendation}
                                                onChange={(e) =>
                                                  handleChange(
                                                    index,
                                                    "recommendation",
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </Col>
                                            <Col md={6}>
                                              <Form.Control
                                                type="text"
                                                placeholder="Notes"
                                                value={pres.notes}
                                                onChange={(e) =>
                                                  handleChange(
                                                    index,
                                                    "notes",
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </Col>
                                          </>
                                        )}
                                      </Row>
                                    ))}

                                    <Row className="mt-4">
                                      <Col>
                                        <Button
                                          variant="primary"
                                          onClick={() =>
                                            addPrescription("medicinal")
                                          }
                                          className="me-2"
                                        >
                                          + Add Medicinal
                                        </Button>
                                        <Button
                                          variant="secondary"
                                          onClick={() =>
                                            addPrescription("non-medicinal")
                                          }
                                          className="me-2"
                                        >
                                          + Add Non-Medicinal
                                        </Button>
                                      </Col>
                                    </Row>
                                  </Container>
                                </div>
                              </div>
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
                            <div>
                              <label>
                                <strong>Doctor's Fee: </strong>
                              </label>
                              <input
                                type="number"
                                placeholder="Doctor's Fee"
                                value={doctorFee}
                                onChange={(e) => setDoctorFee(e.target.value)}
                                className="w-full p-2 mb-2 border rounded"
                                required
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
                          className="btn btn-primary"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to mark this visit as complete?"
                              )
                            ) {
                              handleCompleteVisit(selectedVisit._id);
                              handleSubmitVisitDetails();
                              closeModal();
                            }
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </>
                }
              />
            ) : (


              // Modal for the medical certificate purpose
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
                                  <p>
                                    <strong>Purpose: </strong>
                                    {selectedVisit.purpose}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* first content here for medical cert */}
                            <div className="">
                              <div className="wrapper-content">
                                <Row>
                                  <Col>
                                    <Card>
                                      <CardHeader>CXR</CardHeader>
                                      <Card.Body>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <label>
                                            <input
                                              type="radio"
                                              name="CXR"
                                              value="Normal"
                                              checked={
                                                medCertSelections.CXR ===
                                                "Normal"
                                              }
                                              onChange={() =>
                                                handleMedCertRadioChange(
                                                  "CXR",
                                                  "Normal"
                                                )
                                              }
                                            />{" "}
                                            Normal{" "}
                                          </label>
                                          <br />
                                          <label>
                                            <input
                                              type="radio"
                                              name="CXR"
                                              value="With Findings"
                                              checked={
                                                medCertSelections.CXR ===
                                                "With Findings"
                                              }
                                              onChange={() =>
                                                handleMedCertRadioChange(
                                                  "CXR",
                                                  "With Findings"
                                                )
                                              }
                                            />{" "}
                                            With Findings{" "}
                                          </label>
                                        </div>
                                      </Card.Body>
                                    </Card>
                                  </Col>

                                  <Col>
                                    <Card>
                                      <CardHeader>CBC</CardHeader>
                                      <Card.Body>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <label>
                                            <input
                                              type="radio"
                                              name="CBC"
                                              value="Normal"
                                              checked={
                                                medCertSelections.CBC ===
                                                "Normal"
                                              }
                                              onChange={() =>
                                                handleMedCertRadioChange(
                                                  "CBC",
                                                  "Normal"
                                                )
                                              }
                                            />{" "}
                                            Normal{" "}
                                          </label>
                                          <br />
                                          <label>
                                            <input
                                              type="radio"
                                              name="CBC"
                                              value="With Findings"
                                              checked={
                                                medCertSelections.CBC ===
                                                "With Findings"
                                              }
                                              onChange={() =>
                                                handleMedCertRadioChange(
                                                  "CBC",
                                                  "With Findings"
                                                )
                                              }
                                            />{" "}
                                            With Findings{" "}
                                          </label>
                                        </div>
                                      </Card.Body>
                                    </Card>
                                  </Col>

                                  <Col>
                                    <Card>
                                      <CardHeader>Urinalysis</CardHeader>
                                      <Card.Body>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <label>
                                            <input
                                              type="radio"
                                              name="Urinalysis"
                                              value="Normal"
                                              checked={
                                                medCertSelections.Urinalysis ===
                                                "Normal"
                                              }
                                              onChange={() =>
                                                handleMedCertRadioChange(
                                                  "Urinalysis",
                                                  "Normal"
                                                )
                                              }
                                            />{" "}
                                            Normal{" "}
                                          </label>
                                          <br />
                                          <label>
                                            <input
                                              type="radio"
                                              name="Urinalysis"
                                              value="With Findings"
                                              checked={
                                                medCertSelections.Urinalysis ===
                                                "With Findings"
                                              }
                                              onChange={() =>
                                                handleMedCertRadioChange(
                                                  "Urinalysis",
                                                  "With Findings"
                                                )
                                              }
                                            />{" "}
                                            With Findings{" "}
                                          </label>
                                        </div>
                                      </Card.Body>
                                    </Card>
                                  </Col>

                                  <Col>
                                    <Card>
                                      <CardHeader>Drug Test</CardHeader>
                                      <Card.Body>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <label>
                                            <input
                                              type="radio"
                                              name="DrugTest"
                                              value="Negative"
                                              checked={
                                                medCertSelections.DrugTest ===
                                                "Negative"
                                              }
                                              onChange={() =>
                                                handleMedCertRadioChange(
                                                  "DrugTest",
                                                  "Negative"
                                                )
                                              }
                                            />{" "}
                                            Negative{" "}
                                          </label>
                                          <br />
                                          <label>
                                            <input
                                              type="radio"
                                              name="DrugTest"
                                              value="Positive"
                                              checked={
                                                medCertSelections.DrugTest ===
                                                "Positive"
                                              }
                                              onChange={() =>
                                                handleMedCertRadioChange(
                                                  "DrugTest",
                                                  "Positive"
                                                )
                                              }
                                            />{" "}
                                            Positive{" "}
                                          </label>
                                        </div>
                                      </Card.Body>
                                    </Card>
                                  </Col>
                                </Row>
                              </div>
                              <br />

{/* Second part of the content here for medical cert */}
                              <h3>Physical Examination</h3>

                              <Row>
                                <Col> </Col>

                                <Col>
                                  <strong>E/N</strong>
                                </Col>
                                <Col>
                                  <strong>Findings</strong>
                                </Col>
                                <Col>
                                  <strong>Descriptions</strong>
                                </Col>
                              </Row>

                              <Card className="p-3">
                                <Row>
                                  <Col>General Appearance, body built</Col>

                                  <Col>
                                    <strong>
                                      <input type="checkbox" value="E/N" />
                                    </strong>
                                  </Col>
                                  <Col>
                                    <strong>{""}</strong>
                                  </Col>
                                  <Col>
                                    <input
                                      type="text"
                                      value={textValue}
                                      onChange={handleCheckBoxChange}
                                    />
                                  </Col>
                                </Row>
                              </Card>

                              <Card className="p-3">
                                <Row>
                                  <Col>Skin</Col>

                                  <Col>
                                    <strong>
                                      <input type="checkbox" value="E/N" />
                                    </strong>
                                  </Col>
                                  <Col>
                                    <div>
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Discoloration"
                                        />{" "}
                                        Discoloration
                                      </label>
                                      <br />
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Congenital Marks"
                                        />{" "}
                                        Congenital Marks
                                      </label>{" "}
                                      <br />
                                      <label>
                                        <input type="checkbox" value="Lesion" />{" "}
                                        Lesion
                                      </label>{" "}
                                      <br />
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Deformity"
                                        />{" "}
                                        Deformity
                                      </label>{" "}
                                      <br />
                                    </div>
                                  </Col>
                                  <Col>
                                    <input
                                      type="text"
                                      value={textValue}
                                      onChange={handleCheckBoxChange}
                                    />
                                  </Col>
                                </Row>
                              </Card>

                              <Card className="p-3">
                                <Row>
                                  <Col>Head</Col>

                                  <Col>
                                    <strong>
                                      <input type="checkbox" value="E/N" />
                                    </strong>
                                  </Col>
                                  <Col>
                                    <div>
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Lesion (Acne)"
                                        />{" "}
                                        Lesion (Acne)
                                      </label>{" "}
                                      <br />
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Deformity"
                                        />{" "}
                                        Deformity
                                      </label>{" "}
                                      <br />
                                    </div>
                                  </Col>
                                  <Col>
                                    <input
                                      type="text"
                                      value={textValue}
                                      onChange={handleCheckBoxChange}
                                    />
                                  </Col>
                                </Row>
                              </Card>
                              <Card className="p-3">
                                <Row>
                                  <Col>Eyes</Col>

                                  <Col>
                                    <strong>
                                      <input type="checkbox" value="E/N" />
                                    </strong>
                                  </Col>
                                  <Col>
                                    <div>
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Inflammation"
                                        />{" "}
                                        Inflammation
                                      </label>
                                      <br />
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Discharge"
                                        />{" "}
                                        Discharge
                                      </label>{" "}
                                      <br />
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Redness"
                                        />{" "}
                                        Redness
                                      </label>{" "}
                                      <br />
                                    </div>
                                  </Col>
                                  <Col>
                                    <input
                                      type="text"
                                      value={textValue}
                                      onChange={handleCheckBoxChange}
                                    />
                                  </Col>
                                </Row>
                              </Card>
                              <Card className="p-3">
                                <Row>
                                  <Col>Ears</Col>

                                  <Col>
                                    <strong>
                                      <input type="checkbox" value="E/N" />
                                    </strong>
                                  </Col>
                                  <Col>
                                    <div>
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Inflammation"
                                        />{" "}
                                        Inflammation
                                      </label>
                                      <br />
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Discharge"
                                        />{" "}
                                        Discharge
                                      </label>
                                      <br />
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Deformity"
                                        />{" "}
                                        Deformity
                                      </label>{" "}
                                      <br />
                                    </div>
                                  </Col>
                                  <Col>
                                    <input
                                      type="text"
                                      value={textValue}
                                      onChange={handleCheckBoxChange}
                                    />
                                  </Col>
                                </Row>
                              </Card>
                              <Card className="p-3">
                                <Row>
                                  <Col>Nose</Col>

                                  <Col>
                                    <strong>
                                      <input type="checkbox" value="E/N" />
                                    </strong>
                                  </Col>
                                  <Col>
                                    <div>
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Ulcer/Lesion"
                                        />{" "}
                                        Ulcer/Lesion
                                      </label>
                                      <br />
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Discharge"
                                        />{" "}
                                        Discharge
                                      </label>
                                      <br />
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Bleeding"
                                        />{" "}
                                        Bleeding
                                      </label>{" "}
                                      <br />
                                      <label>
                                        <input
                                          type="checkbox"
                                          value="Deformity"
                                        />{" "}
                                        Deformity
                                      </label>{" "}
                                      <br />
                                    </div>
                                  </Col>
                                  <Col>
                                    <input
                                      type="text"
                                      value={textValue}
                                      onChange={handleCheckBoxChange}
                                    />
                                  </Col>
                                </Row>
                              </Card>
                            </div>

                            <br />
                            <div>
                              {/* FITNESS CERTIFICATION SECTION */}
                              <Card className="p-3">
                                <h5>FITNESS CERTIFICATION</h5>

                                <Row className="mb-3">
                                  <Col>
                                    <Form.Check
                                      type="radio"
                                      label="Fit for enrollment"
                                      name="fitness"
                                    />
                                    <Form.Check
                                      type="radio"
                                      label="Not fit for enrollment"
                                      name="fitness"
                                    />
                                    <Form.Check
                                      type="radio"
                                      label="Pending, reason:"
                                      name="fitness"
                                    />
                                    <Form.Control
                                      type="text"
                                      placeholder="Specify reason"
                                    />
                                  </Col>
                                </Row>

                                <h6>For work enlistment</h6>
                                <Row>
                                  <Col>
                                    <Form.Check
                                      type="radio"
                                      label="Class A – Fit for all types of work. No physical defect noted."
                                      name="class"
                                    />
                                    <Form.Check
                                      type="radio"
                                      label="Class B – Fit for all types of work. Has minor ailment. Needs treatment."
                                      name="class"
                                    />
                                    <Form.Check
                                      type="radio"
                                      label="Class C – Employment at the risk and discretion of management."
                                      name="class"
                                    />
                                    <Form.Check
                                      type="radio"
                                      label="Unfit, due to:"
                                      name="class"
                                    />
                                    <Form.Control
                                      type="text"
                                      placeholder="Specify condition"
                                    />
                                  </Col>
                                </Row>

                                <Row className="mt-3">
                                  <Col>
                                    <strong>Impression:</strong>
                                    <br />
                                    <Form.Check
                                      type="checkbox"
                                      label="Essentially normal medical examination findings at the time of examination."
                                    />
                                    <Form.Check
                                      type="checkbox"
                                      label="Others:"
                                    />
                                    <Form.Control
                                      type="text"
                                      placeholder="Other remarks"
                                    />
                                  </Col>

                                  <Col>
                                    <strong>Recommendation/s:</strong>
                                    <Form.Control as="textarea" rows={3} />
                                  </Col>
                                </Row>

                                <Row className="mt-4">
                                  <Col>
                                    <Form.Label>
                                      Signature Above Printed Name of Attending
                                      Physician
                                    </Form.Label>
                                    <Form.Control type="text" />
                                  </Col>
                                  <Col>
                                    <Form.Label>License Number</Form.Label>
                                    <Form.Control type="text" />
                                  </Col>
                                  <Col>
                                    <Form.Label>Date of Examination</Form.Label>
                                    <Form.Control type="date" />
                                  </Col>
                                </Row>
                              </Card>
                            </div>
                            {/* <div>
                              <label>
                                <strong>Doctor's Fee: </strong>
                              </label>
                              <input
                                type="number"
                                placeholder="Doctor's Fee"
                                value={doctorFee}
                                onChange={(e) => setDoctorFee(e.target.value)}
                                className="w-full p-2 mb-2 border rounded"
                                required
                              />
                            </div> */}
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
                          className="btn btn-primary"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to mark this visit as complete?"
                              )
                            ) {
                              // handleCompleteVisit(selectedVisit._id);
                              handleMedCertSubmit();
                              closeModal();
                            }
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </>
                }
              />
            )}
          </div>
        }
      />
    </div>
  );
};

export default DoctorPatient;
