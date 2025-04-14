import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
  CardHeader,
} from "react-bootstrap";
import axios from "axios";

const XrayBilling = () => {
  const [searchTerm, setSearchTerm] = useState(""); // should be a string
  const [procedure, setProcedure] = useState(null); // set to null initially
  const [error, setError] = useState("");
  const [patientData, setPatientData] = useState(null); // state to hold patient data
  const [patientId, setPatientId] = useState(""); // state to hold patient ID
  //fetch the patient data
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

  //function to handle search
  const handleSearch = async () => {
    if (searchTerm.trim() !== "") {
      try {
        const response = await axios.get(
          `https://localhost:3000/xray/getXray/${searchTerm}`
        );
        setProcedure(response.data);
        setError("");
      } catch (error) {
        setProcedure(null); // Set procedure to null if error occurs
        setError("Category not found or an error occurred.");
        console.error("Error fetching procedure:", error);
      }
    }
  };

  const xraySidebarLinks = [
    { label: "Dashboard", path: "/xray-dashboard" },
    { label: "Billing", path: "/xray-billing" },
  ];
console.log("Patient Data:", patientData); // Log the patient data to check its structure
  return (
    <div>
      <Sidebar
        links={xraySidebarLinks}
        pageContent={
          <>
            <Container fluid className="p-4 bg-light">
              <Row className="g-4">
                <Col md={6} className="bg-white shadow-sm p-4 rounded mx-auto">
                  <h1 className="mb-4 text-primary">X-Ray Billing</h1>
                  <p className="text-muted">
                    Search for Category and view their details below.
                  </p>
                  <Form
                    className="mb-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearch();
                    }}
                  >
                    <Form.Group controlId="search">
                      <Form.Label className="fw-bold">
                        Search Category
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter procedure name (e.g. APL)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                    </Form.Group>
                    <Button variant="primary" onClick={handleSearch}>
                      Search
                    </Button>
                  </Form>

                  {error && <p className="text-danger fw-bold">{error}</p>}

                  {procedure ? (
                    <div>
                      <CardHeader>Category: {procedure.Category}</CardHeader>
                      {procedure.Procedures &&
                      Array.isArray(procedure.Procedures) ? (
                        <Table striped bordered hover className="mt-4">
                          <thead className="table-primary">
                            <tr>
                              <th>Procedure Name</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {procedure.Procedures.map((proc, index) => (
                              <tr key={index}>
                                <td>{proc.Procedure}</td>
                                <td>{proc.Price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p>No procedures available for this category.</p>
                      )}
                    </div>
                  ) : (
                    <p>Please Enter the Category first...</p>
                  )}
                </Col>

                {/* Generate billing here. Search and select for patient ID and preview the basic information of the patient*/}

                <Col md={6} className="bg-white shadow-sm p-4 rounded mx-auto">
                  <CardHeader className="fw-bold text-primary">
                    Generate Billing
                  </CardHeader>
                  <Form
                    className="mt-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      fetchPatientData();
                    }}
                  >
                    <Form.Group controlId="patientSearch">
                      <Form.Label className="fw-bold">
                        Search Patient by ID
                      </Form.Label>
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
                            <td className="fw-bold">Age</td>
                            <td>{patientData.patient.age}</td>
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
            </Container>
          </>
        }
      />
    </div>
  );
};

export default XrayBilling;
