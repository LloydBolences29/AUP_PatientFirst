import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // To get patient ID from URL
import Sidebar from "../../components/Sidebar";
import "../Patient/PatientProfile.css";

const PatientProfile = () => {

  const {patient_id} = useParams()
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeIndex, setActiveIndex] = useState(null);

  // ✅ Corrected Sidebar Links
  const menuLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Profile", path: patient?._id ? `/profile/${patient._id}` : "#" }, // ✅ Use id from useParams
    { label: "Medical Records", path: "/" },
    { label: "Billing", path: "/" },
  ];

  useEffect(() => {
    console.log("Patient ID:", patient_id); // ✅ Debugging step    if (!patientID) {
      if (!patient_id) {
      setError("Patient ID is missing");
      setLoading(false);
      return;
    }
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/patientname/${patient_id}`); // ✅ Use id from useParams
        setPatient(response.data);
      } catch (err) {
        setError("Error fetching patient data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [patient_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Sidebar
        props={menuLinks}
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
                        src={patient?.profileImage || "../../../public/img/profile.jpg"}
                        alt="profile"
                      />
                    </div>
                    <div id="patient-info-wrapper">
                      <div className="grid-items item-2 patient-basic-info">
                        <div className="patient-name">
                          <h2 id="patient-name">{patient?.firstname || "N/A"}</h2>
                        </div>
                        <div className="additional-patient-info">
                          <div className="add-info-flex-items" id="gender">
                            <p>{patient?.gender || "N/A"}</p>
                          </div>
                          <div className="add-info-flex-items" id="religion">
                            <p>{patient?.religion || "N/A"}</p>
                          </div>
                          <div className="add-info-flex-items" id="patient-ID">
                            <p>{patient?.id || "N/A"}</p>
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
                          <p>{patient?.weight || "N/A"} kg</p>
                        </div>
                        <div>
                          <label>Heart Rate:</label>
                          <p>{patient?.heartRate || "N/A"} bpm</p>
                        </div>
                        <div>
                          <label>Temperature:</label>
                          <p>{patient?.temperature || "N/A"} °C</p>
                        </div>
                        <div>
                          <label>Pulse Rate:</label>
                          <p>{patient?.pulseRate || "N/A"} bpm</p>
                        </div>
                        <div>
                          <label>Respiratory Rate:</label>
                          <p>{patient?.respiratoryRate || "N/A"} bpm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="button-wrapper">
                  <div className="btn">
                    <button
                      className={`btn btn-outline-primary ${activeIndex === 0 ? "active" : ""}`}
                      onClick={() => setActiveIndex(0)}
                    >
                      Personal Information
                    </button>
                  </div>
                  <div className="btn">
                    <button
                      className={`btn btn-outline-primary ${activeIndex === 1 ? "active" : ""}`}
                      onClick={() => setActiveIndex(1)}
                    >
                      Result
                    </button>
                  </div>
                  <div className="btn">
                    <button
                      className={`btn btn-outline-primary ${activeIndex === 2 ? "active" : ""}`}
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
                          <label>First Name:</label>
                          <p>{patient?.firstName || "N/A"}</p>
                          <label>Middle Initial:</label>
                          <p>{patient?.middleInitial || "N/A"}</p>
                          <label>Surname:</label>
                          <p>{patient?.lastName || "N/A"}</p>
                        </div>

                        <div className="grid-item basic-additional-info">
                          <label>Address:</label>
                          <p>{patient?.address || "N/A"}</p>

                          <label>Date of Birth:</label>
                          <p>{patient?.dob || "N/A"}</p>

                          <label>Age:</label>
                          <p>{patient?.age || "N/A"}</p>
                        </div>

                        <div className="grid-item additional-info">
                          <label>Phone Number:</label>
                          <p>{patient?.phone || "N/A"}</p>

                          <label>Email:</label>
                          <p>{patient?.email || "N/A"}</p>

                          <label>Blood Type:</label>
                          <p>{patient?.bloodType || "N/A"}</p>
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
                                <label>Full Name:</label>
                                <p>{patient?.emergencyContact?.name || "N/A"}</p>
                              </div>
                              <div className="emergency-grid-items">
                                <label>Relationship:</label>
                                <p>{patient?.emergencyContact?.relationship || "N/A"}</p>
                              </div>
                              <div className="emergency-grid-items">
                                <label>Phone Number:</label>
                                <p>{patient?.emergencyContact?.phone || "N/A"}</p>
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