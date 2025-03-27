import React from "react";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const Prescriptions = () => {
  const pharmasidebarLinks = [
    { label: "Pharmacy Dashboard", path: "/pharma-dashboard" },
    { label: "Medicine List", path: "/medicine-list" },
    { label: "Pharmacy Transaction", path: "/pharma-transaction" },
    { label: "Prescriptions", path: "/prescription-page" },
    { label: "Analytics and Reports", path: "/pharma-analytics" },
  ];

  const [prescriptions, setPrescriptions] = useState([]);
  const [checkupId, setCheckupId] = useState(null);
  const [patientId, setPatientId] = useState(null);


  const addPrescription = (type) => {
    setPrescriptions([
      ...prescriptions,
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

  const handleChange = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handleSubmit = async () => {
    if (!checkupId || !patientId) {
      alert("Missing required data! Checkup ID or Patient ID is missing.");
      console.error("Error: Missing checkupId or patientId", { checkupId, patientId });
      return;
    }
  
    try {
      await axios.post(
        "http://localhost:3000/prescriptions/createPrescription",
        { checkupId, patientId, prescriptions }
      );
      alert("Prescription saved successfully!");
    } catch (error) {
      console.error("Error saving prescription:", error);
    }
  };

  useEffect(() => {
    if (patientId) {
      axios
        .get(`http://localhost:3000/checkups/latest?patientId=${patientId}`)
        .then((response) => {
          if (response.data?.checkupId) {
            setCheckupId(response.data.checkupId);
          }
        })
        .catch((error) => console.error("Error fetching checkupId:", error));
    }
  }, [patientId]);

  return (
    <div>
      <Sidebar
        links={pharmasidebarLinks}
        pageContent={
          <Container>
            <h2 className="my-4">Prescription Form</h2>
            {prescriptions.map((pres, index) => (
              <Row key={index} className="prescription-entry mb-3">
                {pres.type === "medicinal" ? (
                  <>
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        placeholder="Medication"
                        value={pres.medication}
                        onChange={(e) =>
                          handleChange(index, "medication", e.target.value)
                        }
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Control
                        type="text"
                        placeholder="Dosage"
                        value={pres.dosage}
                        onChange={(e) =>
                          handleChange(index, "dosage", e.target.value)
                        }
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Control
                        type="text"
                        placeholder="Frequency"
                        value={pres.frequency}
                        onChange={(e) =>
                          handleChange(index, "frequency", e.target.value)
                        }
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Control
                        type="text"
                        placeholder="Duration"
                        value={pres.duration}
                        onChange={(e) =>
                          handleChange(index, "duration", e.target.value)
                        }
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
                          handleChange(index, "recommendation", e.target.value)
                        }
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Notes"
                        value={pres.notes}
                        onChange={(e) =>
                          handleChange(index, "notes", e.target.value)
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
                  onClick={() => addPrescription("medicinal")}
                  className="me-2"
                >
                  + Add Medicinal
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => addPrescription("non-medicinal")}
                  className="me-2"
                >
                  + Add Non-Medicinal
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                  Submit Prescription
                </Button>
              </Col>
            </Row>
          </Container>
        }
      />
    </div>
  );
};

export default Prescriptions;
