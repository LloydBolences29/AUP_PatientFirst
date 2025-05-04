import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Form, Card, Button, Container, Row, Col, Table } from "react-bootstrap";
import axios from "axios";

const LabUpload = () => {
  const labSidebarLinks = [
    { label: "Dashboard", path: "/lab-dashboard" },
    { label: "Billing", path: "/lab-billing" },
    { label: "Upload", path: "/lab-upload" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [patientId, setPatientId] = useState(""); // state to hold patient ID
  const [patientData, setPatientData] = useState(null); // state to hold patient data

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(
        `https://localhost:3000/patientname/${patientId}`
      );
      if (response.data) {
        setPatientData(response.data);
      } else {
        setPatientData(null);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setPatientData(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Uploaded file:", file);
    }
  };

  return (
    <div>
      <Sidebar
        links={labSidebarLinks}
        pageContent={
          <>
            <Container>
              <Card
                md={9}
                className="content-column analytics-card shadow-sm p-3 bg-white rounded text-center"
              >
                <div className="page-content">
                  <h1
                    className="page-title fw-bold"
                    style={{ color: "#2c3e50" }}
                  >
                    Laboratory Upload Result
                  </h1>
                </div>
              </Card>{" "}
              <Row className="mb-4">
                <Col>
                  <Form
                    className="mt-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      fetchPatientData();
                    }}
                  >
                    <Form.Group controlId="patientSearch">
                      <Form.Label className="fw-bold">Patient ID</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Patient ID"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="mb-2"
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Search
                    </Button>
                  </Form>

                  {patientData ? (
                    <div className="mt-4">
                      <h5 className="text-success">Patient Information</h5>
                      <Table striped bordered hover>
                        <tbody>
                          <tr>
                            <td className="fw-bold">Patient ID</td>
                            <td>{patientData.patient.patient_id}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Name</td>
                            <td>{patientData.patient.firstname}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Gender</td>
                            <td>{patientData.patient.gender}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    patientId && (
                      <p className="text-danger mt-3">Patient not found.</p>
                    )
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="imageUpload">
                    <Form.Label>Upload Image:</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Button variant="primary">Submit</Button>
                </Col>
              </Row>
            </Container>
          </>
        }
      />
    </div>
  );
};

export default LabUpload;
