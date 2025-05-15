import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // To get patient ID from URL
import Sidebar from "../../components/Sidebar";
import "../Patient/PatientProfile.css";
import { Button, Form, InputGroup } from "react-bootstrap"; // Add React Bootstrap imports
import { NULL } from "sass";

const PatientProfile = () => {
  const [patientId, setPatientId] = useState(null); // Store patient ID from JWT
  const [patient, setPatient] = useState(null); // Store patient details from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [editableField, setEditableField] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [vitals, setVitals] = useState([])

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setEditedValues({ ...editedValues, [field]: value });
  };

  // Function to save changes
  
  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const response = await axios.get("https://aup-patientfirst-server.onrender.com/patientname/auth/me", {
          withCredentials: true, // ✅ Ensures cookies are sent
        });
        
        console.log("Received Patient ID from Backend:", response.data.id);
        setPatientId(response.data.id);
      } catch (err) {
        console.error("Error fetching patient ID:", err);
        setError("Failed to retrieve patient ID.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientId();
  }, []);
  
  // ✅ Fetch patient data when patientId is set
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) return; // ✅ Prevent fetching if patientId is missing
      
      try {
        setLoading(true);
        console.log("Fetching patient data for ID:", patientId);
        const response = await axios.get(
          `https://aup-patientfirst-server.onrender.com/patientname/${patientId}`
        );
        setPatient(response.data.patient);
        console.log("Fetched Patient Data:", response.data.patient);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Error fetching patient data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [patientId]);


  useEffect(() => {
    const fetchPatientVisits = async () => {
      try {
        if (!patient?._id) return; // Ensure patientId is available

        const response = await axios.get(`https://aup-patientfirst-server.onrender.com/patient-visit/fetchVisit/${patient._id}`);
        setVitals(response.data.visits); // Set array of visits
        console.log("📌 Patient Visits:", response.data.visits);
      } catch (error) {
        console.error("❌ Error fetching visits:", error.response?.data || error.message);
      }
    };

    fetchPatientVisits();
  }, [patient]); // Runs when patientId changes
 
  
  const menuLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Symptom Checker", path: "/symptomChecker" },
    { label: "My Profile", path: `/profile/${patientId || ""}` },
     { label: "Request", path: "/request" },
  ];

  const saveChanges = async (patientId, field, value) => {
    try {
      console.log("🛠 Sending update request for Patient ID:", patientId);
      console.log("🛠 Updating field:", field, "with value:", value);
      const response = await axios.put(
        `https://aup-patientfirst-server.onrender.com/patientname/${patientId}`,
        { [field]: value }, // ✅ Ensure JSON body
        {
          headers: { "Content-Type": "application/json" }, // ✅ Fix missing header
          withCredentials: true, // ✅ Ensure cookies are sent if needed
        }
      );
  
      console.log("Updated patient:", response.data);
      alert("Patient info updated successfully!");
    } catch (error) {
      console.error("Error updating patient:", error);
      alert(error.response?.data?.message || "Error updating patient info.");
    }
    setPatient((prev) => ({ ...prev, [field]: value }));
     setEditableField(null);
  };
  return (
    <div>
      <Sidebar
        links={menuLinks}
        activeLink="Profile"
        pageContent={
          <>
            <div className="pageContent-container">
              <div className="pageContent-wrapper">
                {/* Patient Profile Header */}
                <div className="patient-profile-header">
                  <div className="patient-profile-wrapper">
                    <div className="grid-items item-1 patient-profile-img">
                      <img
                        id="patient-profile-img"
                        src={"/img/profile.jpg"}
                        alt="profile"
                      />
                    </div>
                    <div id="patient-info-wrapper">
                      <div className="grid-items item-2 patient-basic-info">
                        <div className="patient-name">
                          <h2 id="patient-name">
                            {patient?.firstname || "N/A"} {patient?.middleinitial} {patient?.lastname || "N/A"}
                          </h2>
                        </div>
                        <div className="additional-patient-info">
                          <div className="add-info-flex-items" id="gender">
                            <p>{patient?.gender || "N/A"}</p>
                          </div>
                          <div className="add-info-flex-items" id="religion">
                            <p>{patient?.religion || "N/A"}</p>
                          </div>
                          <div className="add-info-flex-items" id="patient-ID">
                            <p>{patient?.patient_id || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid-items item-3 patient-vital-signs">
                        <div>
                          <label>BMI:</label>
                          <p>{patient?.bmi || "N/A"}</p>
                        </div>
                        <div>
                          <label>Weight:</label>
                          <p>{vitals.length > 0 ? vitals[0]?.weight : "N/A"} kg</p>
                        </div>
                    
                        <div>
                          <label>Temperature:</label>
                          <p>{vitals[0]?.temperature || "N/A"} °C</p>
                        </div>
                        <div>
                          <label>Pulse Rate:</label>
                          <p>{vitals[0]?.pulse_rate || "N/A"} bpm</p>
                        </div>
                        <div>
                          <label>Respiratory Rate:</label>
                          <p>{vitals[0]?.respiratory_rate || "N/A"} bpm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="button-wrapper">
                  <div className="btn">
                    <button
                      className={`btn btn-outline-primary ${
                        activeIndex === 0 ? "active" : ""
                      }`}
                      onClick={() => setActiveIndex(0)}
                    >
                      Personal Information
                    </button>
                  </div>
                  <div className="btn">
                    <button
                      className={`btn btn-outline-primary ${
                        activeIndex === 1 ? "active" : ""
                      }`}
                      onClick={() => setActiveIndex(1)}
                    >
                      Result
                    </button>
                  </div>
                  <div className="btn">
                    <button
                      className={`btn btn-outline-primary ${
                        activeIndex === 2 ? "active" : ""
                      }`}
                      onClick={() => setActiveIndex(2)}
                    >
                      Others
                    </button>
                  </div>
                </div>

                <div className="profile-content">
                  <div className="profile-wrapper">
                    <div className="profile-header">
                      <h2>Personal Information</h2>
                    </div>

                    <br />

                    <div className="profile-data-container">
                      <div className="profile-data-wrapper">
                        <div className="grid-item patient-fullname">
                          <label>
                            First Name:
                            {editableField !== "firstname" && (
                              <span
                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" }}
                                onClick={() => setEditableField("firstname")}
                              >
                                Edit
                              </span>
                            )}
                          </label>
                          {editableField === "firstname" ? (
                            <InputGroup>
                              <Form.Control
                                type="text"
                                value={editedValues.firstname || patient?.firstname || ""}
                                onChange={(e) => handleInputChange("firstname", e.target.value)}
                              />
                              <Button
                                variant="success"
                                style={{ backgroundColor: "green", borderColor: "green", color: "white" }}
                                onClick={() => saveChanges(patient?.patient_id, "firstname", editedValues.firstname)}
                              >
                                Save
                              </Button>
                            </InputGroup>
                          ) : (
                            <p>{patient?.firstname || "N/A"}</p>
                          )}

                          <label>
                            Middle Initial:
                            {editableField !== "middleinitial" && (
                              <span
                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" }}
                                onClick={() => setEditableField("middleinitial")}
                              >
                                Edit
                              </span>
                            )}
                          </label>
                          {editableField === "middleinitial" ? (
                            <InputGroup>
                              <Form.Control
                                type="text"
                                value={editedValues.middleinitial || patient?.middleinitial || ""}
                                onChange={(e) => handleInputChange("middleinitial", e.target.value)}
                              />
                              <Button
                                variant="success"
                                style={{ backgroundColor: "green", borderColor: "green", color: "white" }}
                                onClick={() => saveChanges(patient?.patient_id, "middleinitial", editedValues.middleinitial)}
                              >
                                Save
                              </Button>
                            </InputGroup>
                          ) : (
                            <p>{patient?.middleinitial || "N/A"}</p>
                          )}

                          <label>
                            Surname:
                            {editableField !== "lastname" && (
                              <span
                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" }}
                                onClick={() => setEditableField("lastname")}
                              >
                                Edit
                              </span>
                            )}
                          </label>
                          {editableField === "lastname" ? (
                            <InputGroup>
                              <Form.Control
                                type="text"
                                value={editedValues.lastname || patient?.lastname || ""}
                                onChange={(e) => handleInputChange("lastname", e.target.value)}
                              />
                              <Button
                                variant="success"
                                style={{ backgroundColor: "green", borderColor: "green", color: "white" }}
                                onClick={() => saveChanges(patient?.patient_id, "lastname", editedValues.lastname)}
                              >
                                Save
                              </Button>
                            </InputGroup>
                          ) : (
                            <p>{patient?.lastname || "N/A"}</p>
                          )}
                        </div>

                        <div className="grid-item basic-additional-info">
                          <label>
                            Address:
                            {editableField !== "home_address" && (
                              <span
                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" }}
                                onClick={() => setEditableField("home_address")}
                              >
                                Edit
                              </span>
                            )}
                          </label>
                          {editableField === "home_address" ? (
                            <InputGroup>
                              <Form.Control
                                type="text"
                                value={editedValues.home_address || patient?.home_address || ""}
                                onChange={(e) => handleInputChange("home_address", e.target.value)}
                              />
                              <Button
                                variant="success"
                                style={{ backgroundColor: "green", borderColor: "green", color: "white" }}
                                onClick={() => saveChanges(patient?.patient_id, "home_address", editedValues.home_address)}
                              >
                                Save
                              </Button>
                            </InputGroup>
                          ) : (
                            <p>{patient?.home_address || "N/A"}</p>
                          )}

                          <label>
                            Date of Birth:
                            {editableField !== "dob" && (
                              <span
                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" }}
                                onClick={() => setEditableField("dob")}
                              >
                                Edit
                              </span>
                            )}
                          </label>
                          {editableField === "dob" ? (
                            <InputGroup>
                              <Form.Control
                                type="date"
                                value={editedValues.dob || (patient?.dob ? new Date(patient.dob).toISOString().split("T")[0] : "")}
                                onChange={(e) => handleInputChange("dob", e.target.value)}
                              />
                              <Button
                                variant="success"
                                style={{ backgroundColor: "green", borderColor: "green", color: "white" }}
                                onClick={() => saveChanges(patient?.patient_id, "dob", editedValues.dob)}
                              >
                                Save
                              </Button>
                            </InputGroup>
                          ) : (
                            <p>{patient?.dob ? new Date(patient.dob).toISOString().split("T")[0] : "N/A"}</p>
                          )}

                          <label>
                            Age:
                            {editableField !== "age" && (
                              <span
                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" }}
                                onClick={() => setEditableField("age")}
                              >
                                Edit
                              </span>
                            )}
                          </label>
                          {editableField === "age" ? (
                            <InputGroup>
                              <Form.Control
                                type="number"
                                value={editedValues.age || patient?.age || ""}
                                onChange={(e) => handleInputChange("age", e.target.value)}
                              />
                              <Button
                                variant="success"
                                style={{ backgroundColor: "green", borderColor: "green", color: "white" }}
                                onClick={() => saveChanges(patient?.patient_id, "age", editedValues.age)}
                              >
                                Save
                              </Button>
                            </InputGroup>
                          ) : (
                            <p>{patient?.age || "N/A"}</p>
                          )}
                        </div>

                        <div className="grid-item additional-info">
                          <label>
                            Phone Number:
                            {editableField !== "contact_number" && (
                              <span
                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" }}
                                onClick={() => setEditableField("contact_number")}
                              >
                                Edit
                              </span>
                            )}
                          </label>
                          {editableField === "contact_number" ? (
                            <InputGroup>
                              <Form.Control
                                type="text"
                                value={editedValues.contact_number || patient?.contact_number || ""}
                                onChange={(e) => handleInputChange("contact_number", e.target.value)}
                              />
                              <Button
                                variant="success"
                                style={{ backgroundColor: "green", borderColor: "green", color: "white" }}
                                onClick={() => saveChanges(patient?.patient_id, "contact_number", editedValues.contact_number)}
                              >
                                Save
                              </Button>
                            </InputGroup>
                          ) : (
                            <p>{patient?.contact_number || "N/A"}</p>
                          )}

                          <label>
                            Blood Type:
                            {editableField !== "bloodType" && (
                              <span
                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" }}
                                onClick={() => setEditableField("bloodType")}
                              >
                                Edit
                              </span>
                            )}
                          </label>
                          {editableField === "bloodType" ? (
                            <InputGroup>
                              <Form.Control
                                type="text"
                                value={editedValues.bloodType || patient?.bloodType || ""}
                                onChange={(e) => handleInputChange("bloodType", e.target.value)}
                              />
                              <Button
                                variant="success"
                                style={{ backgroundColor: "green", borderColor: "green", color: "white" }}
                                onClick={() => saveChanges(patient?.patient_id, "bloodType", editedValues.bloodType)}
                              >
                                Save
                              </Button>
                            </InputGroup>
                          ) : (
                            <p>{patient?.bloodType || "N/A"}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="lower-information">
                      <div className="emergency-contact-container">
                        <div className="emergency-contact-wrapper">
                          <div className="emergency-contact-header">
                            <h2>Emergency Contact</h2>
                          </div>

                          <div className="emergency-contact-content">
                            <div className="emergency-contact-data">
                              <div className="emergency-grid-items">
                                <label>
                                  Full Name:
                                  {editableField !== "emergency_name" && (
                                    <span
                                      style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" }}
                                      onClick={() => setEditableField("emergency_name")}
                                    >
                                      Edit
                                    </span>
                                  )}
                                </label>
                                {editableField === "emergency_name" ? (
                                  <InputGroup>
                                    <Form.Control
                                      type="text"
                                      value={editedValues.emergency_name || patient?.emergency_name || ""}
                                      onChange={(e) => handleInputChange("emergency_name", e.target.value)}
                                    />
                                    <Button
                                      variant="success"
                                      style={{ backgroundColor: "green", borderColor: "green", color: "white" }}
                                      onClick={() => saveChanges(patient?.patient_id, "emergency_name", editedValues.emergency_name)}
                                    >
                                      Save
                                    </Button>
                                  </InputGroup>
                                ) : (
                                  <p>{patient?.emergency_name || "N/A"}</p>
                                )}
                              </div>

                              <div className="emergency-grid-items">
                                <label>
                                  Relationship:
                                  {editableField !== "emergency_relationship" && (
                                    <span
                                      style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" }}
                                      onClick={() => setEditableField("emergency_relationship")}
                                    >
                                      Edit
                                    </span>
                                  )}
                                </label>
                                {editableField === "emergency_relationship" ? (
                                  <InputGroup>
                                    <Form.Select
                                      value={editedValues.emergency_relationship || patient?.emergency_relationship || ""}
                                      onChange={(e) => handleInputChange("emergency_relationship", e.target.value)}
                                    >
                                      <option value="">Select Relationship</option>
                                      <option value="Parent">Parent</option>
                                      <option value="Sibling">Sibling</option>
                                      <option value="Spouse">Spouse</option>
                                      <option value="Friend">Friend</option>
                                      <option value="Other">Other</option>
                                    </Form.Select>
                                    <Button
                                      variant="success"
                                      style={{ backgroundColor: "green", borderColor: "green", color: "white" }}
                                      onClick={() => saveChanges(patient?.patient_id, "emergency_relationship", editedValues.emergency_relationship)}
                                    >
                                      Save
                                    </Button>
                                  </InputGroup>
                                ) : (
                                  <p>{patient?.emergency_relationship || "N/A"}</p>
                                )}
                              </div>

                              <div className="emergency-grid-items">
                                <label>
                                  Phone Number:
                                  {editableField !== "emergency_phone" && (
                                    <span
                                      style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" }}
                                      onClick={() => setEditableField("emergency_phone")}
                                    >
                                      Edit
                                    </span>
                                  )}
                                </label>
                                {editableField === "emergency_phone" ? (
                                  <InputGroup>
                                    <Form.Control
                                      type="text"
                                      value={editedValues.emergency_phone || patient?.emergency_phone || ""}
                                      onChange={(e) => handleInputChange("emergency_phone", e.target.value)}
                                    />
                                    <Button
                                      variant="success"
                                      style={{ backgroundColor: "green", borderColor: "green", color: "white" }}
                                      onClick={() => saveChanges(patient?.patient_id, "emergency_phone", editedValues.emergency_phone)}
                                    >
                                      Save
                                    </Button>
                                  </InputGroup>
                                ) : (
                                  <p>{patient?.emergency_phone || "N/A"}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default PatientProfile;
