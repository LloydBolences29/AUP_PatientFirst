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
  Modal, // Add Modal import
} from "react-bootstrap";
import axios from "axios";

const XrayBilling = () => {
  const [searchTerm, setSearchTerm] = useState(""); // should be a string
  const [procedure, setProcedure] = useState(null); // set to null initially
  const [error, setError] = useState("");
  const [patientData, setPatientData] = useState(null); // state to hold patient data
  const [patientId, setPatientId] = useState(""); // state to hold patient ID
  const [selectedProcedures, setSelectedProcedures] = useState([]); // State to hold multiple selected procedures
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const addProcedure = (proc) => {
    setSelectedProcedures((prev) => [...prev, proc]);
  };

  const removeProcedure = (index) => {
    setSelectedProcedures((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return selectedProcedures.reduce((total, proc) => {
      const price = typeof proc.Price === "string" ? parseFloat(proc.Price.replace('$', '')) : proc.Price;
      return total + price;
    }, 0);
  };


  const handleConfirmBill = () => {
    setShowModal(false); // Close the modal
    console.log("Bill generated successfully!"); // Replace with actual bill generation logic
  };

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

  const handleGenerateBill = async () => {
    try {
      const response = await axios.post(
        `https://localhost:3000/xray/sendXrayBilling/${patientId}`,
        {
          items: selectedProcedures,
        }
      );
  
      console.log("Billing sent successfully:", response.data);
      alert("X-ray billing created successfully!");
    } catch (error) {
      console.error("Error sending billing:", error);
      alert("Failed to create X-ray billing: " + error?.response?.data?.message);
    }
setShowModal(false); // Close the modal after generating the bill

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
                <Col md={12} className="bg-white shadow-sm p-4 rounded mx-auto">
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
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {procedure.Procedures.map((proc, index) => (
                              <tr key={index}>
                                <td>{proc.Procedure}</td>
                                <td>{proc.Price}</td>
                                <td>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => addProcedure(proc)}
                                  >
                                    Add
                                  </Button>
                                </td>
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

                <Col md={6} className="bg-white shadow-sm p-4 rounded mx-auto">
                <CardHeader className="fw-bold text-primary">Search Patient by ID</CardHeader>
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
                    patientId && <p className="text-danger mt-3">Patient not found.</p>
                  )}
                  <CardHeader className="fw-bold text-primary">Selected Procedures</CardHeader>
                  {selectedProcedures.length > 0 && patientData ? (
                    <div>
                      <h5 className="text-success">Bill Details</h5>
                      <Table striped bordered hover className="mt-4">
                        <thead className="table-primary">
                          <tr>
                            <th>Procedure Name</th>
                            <th>Price</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProcedures.map((proc, index) => (
                            <tr key={index}>
                              <td>{proc.Procedure}</td>
                              <td>{proc.Price}</td>
                              <td>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => removeProcedure(index)}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <h5 className="mt-3">Total: ₱{calculateTotal().toFixed(2)}</h5>
                      <Button variant="success" className="mt-3" onClick={() => setShowModal(true)}>
                        Generate Bill
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted mt-3">
                      {selectedProcedures.length === 0
                        ? "No procedures selected."
                        : "Please search for a patient to generate the bill."}
                    </p>
                  )}
                </Col>
              </Row>
            </Container>

            {/* Modal for Bill Confirmation */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Billing</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h5>Patient Information</h5>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <td className="fw-bold">Patient ID</td>
                      <td>{patientData?.patient?.patient_id}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Name</td>
                      <td>{patientData?.patient?.firstname}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Gender</td>
                      <td>{patientData?.patient?.gender}</td>
                    </tr>
                  </tbody>
                </Table>
                <h5 className="mt-4">Selected Procedures</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Procedure Name</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProcedures.map((proc, index) => (
                      <tr key={index}>
                        <td>{proc.Procedure}</td>
                        <td>{proc.Price}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <h5 className="mt-3">Total: ₱{calculateTotal().toFixed(2)}</h5>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="success" onClick={handleGenerateBill}>
                  Confirm and Generate Bill
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        }
      />
    </div>
  );
};

export default XrayBilling;
