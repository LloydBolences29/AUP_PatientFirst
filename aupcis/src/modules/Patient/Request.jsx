import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Container, Row, Col, Alert } from "react-bootstrap";

const Dashboard = () => {
  const { patient_id } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientCounts, setPatientCounts] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestTypes, setRequestTypes] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const sidebarLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Symptom Checker", path: "/symptomChecker" },
    { label: "My Profile", path: `/profile/${patient_id}` },
    { label: "Request", path: "/request" },
  ];

  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const response = await axios.get("https://aup-patientfirst-server.onrender.com/patientname/auth/me", {
          withCredentials: true,
        });
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

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        const response = await axios.get(`https://aup-patientfirst-server.onrender.com/patientname/${patientId}`);
        setPatient(response.data.patient);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Error fetching patient data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [patientId]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!purpose || requestTypes.length === 0) {
      setError("Please complete the form before submitting.");
      return;
    }

    try {
      await axios.post("https://aup-patientfirst-server.onrender.com/formRequest", {
        patientId,
        requestTypes,
        purpose,
      });
      setMessage("Request submitted successfully!");
      setRequestTypes([]);
      setPurpose("");
    } catch (error) {
      setError("Failed to submit request.");
      console.error(error);
    }
  };

  const requestOptions = [
    { id: "medical_certificate", label: "Medical Certificate" },
    { id: "birth_certificate", label: "Birth Certificate" },
    { id: "death_certificate", label: "Death Certificate" },
    { id: "discharge_summary", label: "Discharge Summary" },
    { id: "clinical_summary", label: "Clinical Summary" },
    { id: "lab_xray", label: "Laboratory Result/X-ray" },
    { id: "insurance_form", label: "Insurance Form" },
    { id: "vaccination_certificate", label: "Vaccination Certificate" },
    { id: "others", label: "Others" },
  ];

  return (
    <div>
      <Sidebar
        links={sidebarLinks}
        activeLink="Dashboard"
        pageContent={
          <Container className="mt-4">
            <Row className="justify-content-center">
              <Col xs={12}>
                <Card className="analytics-card shadow-sm p-1 bg-white rounded text-center mb-4">
                  <Card.Body>
                    <h1 className="page-title fw-bold mb-0 text-dark">
                      Request for Release of Information
                    </h1>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12}>
                <Card className="shadow-sm p-3 mb-4 bg-light rounded">
                  <Card.Body>
                    <h2 className="fw-bold mb-3 text-primary">Patient Information</h2>
                    <Row>
                      <Col md={4}>
                        <strong>Patient ID:</strong>
                        <div>{patient?.patient_id || "N/A"}</div>
                      </Col>
                      <Col md={4}>
                        <strong>Patient Name:</strong>
                        <div>{patient ? `${patient.firstname} ${patient.lastname}` : "N/A"}</div>
                      </Col>
                      <Col md={4}>
                        <strong>Date of Birth:</strong>
                        <div>{patient?.dob ? new Date(patient.dob).toISOString().split("T")[0] : "N/A"}</div>
                      </Col>
                      <Col xs={12} className="mt-3">
                        <strong>Purpose of Request:</strong>
                        <input
                          type="text"
                          className="form-control mt-1"
                          placeholder="Enter purpose of request"
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          required
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12}>
                <Card className="shadow-sm p-3 mb-4 bg-light rounded">
                  <Card.Body>
                    <h2 className="fw-bold mb-3 text-primary">Type of Request</h2>
                    <form onSubmit={handleRequestSubmit}>
                      <div style={{ minHeight: "180px" }}>
                        {requestOptions.map((option) => (
                          <div className="form-check" key={option.id}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={option.id}
                              value={option.id}
                              checked={requestTypes.includes(option.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setRequestTypes([...requestTypes, option.id]);
                                } else {
                                  setRequestTypes(requestTypes.filter((t) => t !== option.id));
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor={option.id}>
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary mt-3"
                        disabled={requestTypes.length === 0 || !purpose}
                      >
                        Submit Request
                      </button>

                      {message && <Alert className="mt-3" variant="success">{message}</Alert>}
                      {error && <Alert className="mt-3" variant="danger">{error}</Alert>}
                    </form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        }
      />
    </div>
  );
};

export default Dashboard;
