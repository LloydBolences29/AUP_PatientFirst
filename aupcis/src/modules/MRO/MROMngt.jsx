import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles

import { Container, Card, CardHeader } from "react-bootstrap";

const MROMngt = () => {
  const [visits, setVisits] = useState([]);
  const [search, setSearch] = useState(""); // Added state for search input
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [view, setView] = useState("personalInfo"); // State to manage the current view
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [patientVisits, setPatientVisits] = useState([]);

  useEffect(() => {
    fetchPatientData();
  }, [search]);

  const fetchPatientData = async () => {
    if (search.length > 1) {
      // Avoid fetching if search is too short
      try {
        const response = await axios.get(
          `https://localhost:3000/mro/patients?query=${search}`
        );
        setVisits(response.data); // response.data should be an array now
      } catch (error) {
        console.error("Error fetching patient", error);
      }
    } else {
      setVisits([]); // Clear visits if search is too short
    }
  };

  const filteredVisits = visits.filter(
    (val) =>
      val.patient_id.toString().includes(search) || // Filter by patient ID
      `${val.firstname} ${val.lastname}`
        .toLowerCase()
        .includes(search.toLowerCase()) // Filter by name
  );

  const fetchPatientVisits = async (searchValue) => {
    try {
      const response = await axios.get(
        `https://localhost:3000/mro/checkups/${searchValue}`
      );
      console.log("response", response.data);
      setPatientVisits(response.data);
    } catch (error) {
      console.error("Error fetching visits", error);
    }
  };

  const MROsidebarLinks = [
    { label: "Dashboard", path: "/medicalRecord-dashboard" },
    { label: "Patient Management", path: "/medicalRecord-management" },
  ];
  console.log(
    "Null visits:",
    patientVisits.filter((v) => !v.visitId)
  );

  return (
    <div>
      <Sidebar
        links={MROsidebarLinks}
        pageContent={
          <>
            <div className="container mt-4">
              <h2>Medical Records Office Patient Management</h2>
              <div className="mb-3 d-flex justify-content-between">
                <input
                  type="text"
                  className="form-control w-75"
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)} // Updates search state
                />
              </div>

              {filteredVisits.length > 0 && (
                <div className="list-group w-75">
                  {filteredVisits.map((val) => (
                    <button
                      key={val.patient_id}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setSelectedPatient(val);
                        setSearch(""); // clear search field after selection
                        setVisits([]);
                        fetchPatientVisits(val.patient_id); // call the function to fetch visits
                      }}
                    >
                      {val.firstname} {val.lastname} (ID: {val.patient_id})
                    </button>
                  ))}
                </div>
              )}

              <Container className="table-responsive">
                <Card className="table table-striped table-bordered">
                  {selectedPatient && (
                    <Card className="mt-4">
                      <CardHeader>
                        <h3 className="text-center">
                          {selectedPatient.firstname} {selectedPatient.lastname}
                        </h3>
                      </CardHeader>
                      <div className="p-3">
                        <div className="d-flex justify-content-center mb-3">
                          <button
                            className={`btn ${
                              view === "personalInfo"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            } mx-2`}
                            onClick={() => setView("personalInfo")}
                          >
                            Personal Info
                          </button>
                          <button
                            className={`btn ${
                              view === "visits"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            } mx-2`}
                            onClick={() => setView("visits")}
                          >
                            Visits
                          </button>
                          <button
                            className={`btn ${
                              view === "other"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            } mx-2`}
                            onClick={() => setView("other")}
                          >
                            Other
                          </button>
                        </div>
                        {view === "personalInfo" && (
                          <>
                            <p>
                              <strong>Patient ID:</strong>{" "}
                              {selectedPatient.patient_id}
                            </p>
                            <p>
                              <strong>Age:</strong> {selectedPatient.age}
                            </p>
                            <p>
                              <strong>Gender:</strong> {selectedPatient.gender}
                            </p>
                            {/* Add more personal info fields if needed */}
                          </>
                        )}
                        {view === "visits" && (
                          <>
                            <div className="mb-3">
                              <label htmlFor="visitDate" className="form-label">
                                Filter by Date:
                              </label>
                              <DatePicker
                                id="visitDate"
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                className="form-control"
                                placeholderText="Select a date"
                              />
                            </div>
                            <p>
                              <strong>Visits:</strong>
                            </p>
                            <ul>
                              {patientVisits
                                .filter((visit) => {
                                  if (!visit.visitId) return false; // Skip if visitId is null
                                  if (!selectedDate) return true;
                                  const visitDate = new Date(
                                    visit.visitId.visit_date
                                  );
                                  return (
                                    visitDate.toDateString() ===
                                    selectedDate.toDateString()
                                  );
                                })
                                .map((visit, index) => (
                                  <Card
                                    key={index}
                                    className="mb-3"
                                    style={{
                                      border: "1px solid #007bff",
                                      borderRadius: "8px",
                                      padding: "10px",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    <li>
                                      <strong>Date:</strong>{" "}
                                      {visit.visitId?.visit_date
                                        ? new Date(
                                            visit.visitId.visit_date
                                          ).toLocaleDateString()
                                        : "No date"}
                                      <br />
                                      <strong>Purpose:</strong>{" "}
                                      {visit.visitId?.purpose || "N/A"}
                                      <br />
                                      <strong>Diagnosis:</strong>{" "}
                                      {visit.icd?.length > 0
                                        ? visit.icd
                                            .map(
                                              (icd) =>
                                                `${icd.code} - ${icd.shortdescription}`
                                            )
                                            .join(", ")
                                        : "N/A"}
                                      <br />
                                      <strong>Notes:</strong>{" "}
                                      {visit.additionalNotes || "N/A"}
                                    </li>
                                  </Card>
                                ))}
                            </ul>
                          </>
                        )}

                        {view === "other" && (
                          <>
                            <p>
                              <strong>Other Information:</strong> Add content
                              here.
                            </p>
                          </>
                        )}
                      </div>
                    </Card>
                  )}
                </Card>
              </Container>
            </div>
          </>
        }
      />
    </div>
  );
};

export default MROMngt;
