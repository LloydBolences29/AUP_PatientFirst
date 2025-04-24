import React from "react";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import axios from "axios";



const Prescriptions = () => {
  const pharmasidebarLinks = [
    { label: "Pharmacy Dashboard", path: "/pharma-dashboard" },
    { label: "Medicine List", path: "/medicine-list" },
    { label: "Pharmacy Transaction", path: "/pharma-transaction" },
    { label: "InPatient Transaction", path: "/prescription-page" },
    { label: "Analytics and Reports", path: "/pharma-analytics" },
  ];

  const [prescriptions, setPrescriptions] = useState([]);
  const [checkupId, setCheckupId] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("pending"); // Default to Pending
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [prescriptionToDispense, setPrescriptionToDispense] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [billDetails, setBillDetails] = useState([]);
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const [medicineList, setMedicineList] = useState([]);
  // const [checkupId, setCheckupId] = useState(null);

  

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get(
          "https://aup-patient-first.vercel.app//api/pharma/medicines"
        );
        setMedicineList(res.data.medicines); // Adjust key based on your API response
      } catch (err) {
        console.error("Error fetching medicines", err);
      }
    };

    fetchMedicines();
  }, []);

  useEffect(() => {
    const fetchCheckUps = async () => {
      try {
        const res = await axios.get(
          "https://aup-patient-first.vercel.app//checkup/getCheckup"
        );
        const checkups = res.data.map((checkup) => {
          return {
            ...checkup,
            patientId: checkup.patientId,
            checkupId: checkup._id,
          };
        });
        setCheckupId(checkups);
      } catch (err) {
        console.error("Error fetching checkups", err);
      }
    };
    fetchCheckUps();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch(
        `https://aup-patient-first.vercel.app//prescriptions/fetchPrescriptions?status=${selectedStatus}`
      );
      const data = await res.json();
      console.log("Fetched Data:", data);
      setPrescriptions(data.prescriptions || []); // Ensure it doesn't break
      setFilteredPrescriptions(data.prescriptions || []);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };
  useEffect(() => {
    fetchPrescriptions();
  }, [selectedStatus]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!Array.isArray(prescriptions)) {
      setFilteredPrescriptions([]);
      return;
    }

    const filtered = prescriptions.filter((pres) => {
      const firstName = pres.patientId?.firstname?.toLowerCase() || "";
      const lastName = pres.patientId?.lastname?.toLowerCase() || "";
      const patientId = pres.patientId?.patient_id || "";
      const prescriptionId = pres._id.toLowerCase();

      return (
        firstName.includes(query) ||
        lastName.includes(query) ||
        patientId.includes(query) ||
        prescriptionId.includes(query)
      );
    });

    setFilteredPrescriptions(filtered);
  };

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredPrescriptions(prescriptions);
    }
  }, [prescriptions, searchQuery]);

  const handleFilterChange = (status) => {
    setSelectedStatus(status); // No need to fetch here
    setSelectedPrescription(null); // Close prescription details
  };

  const handleMarkAsDispensed = async (prescriptionId, status) => {
    try {
      const response = await fetch(
        `https://aup-patient-first.vercel.app//prescriptions/update/${prescriptionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      alert(`Prescription marked as ${status}!`);

      // Close prescription details and refresh prescriptions after update
      setSelectedPrescription(null);
      fetchPrescriptions();
    } catch (error) {
      console.error("Error updating prescription status:", error);
      alert("Error updating prescription status");
    }
  };

  const handleRejectPrescription = (prescriptionId) => {
    // Logic to reject prescription
  };

  const handleConfirmDispense = (prescriptionId) => {
    setPrescriptionToDispense(prescriptionId);
    setShowConfirmModal(true);
  };

  const confirmDispense = () => {
    if (prescriptionToDispense) {
      handleMarkAsDispensed(prescriptionToDispense, "dispensed");
    }
    setShowConfirmModal(false);
    setPrescriptionToDispense(null);
  };

  const cancelDispense = () => {
    setShowConfirmModal(false);
    setPrescriptionToDispense(null);
  };

  const handleGenerateBill = (prescription) => {
    const items = prescription.prescriptions.map((med) => {
      const medicineData = medicineList.find(
        (m) => m.name.toLowerCase() === med.medication.toLowerCase()
      );

      return {
        name: med.medication,
        quantity: med.quantity || 0,
        price: medicineData?.price || 0,
      };
    });

    setBillDetails(items);
    setUpdatedQuantities(
      items.reduce((acc, item, index) => {
        acc[index] = item.quantity;
        return acc;
      }, {})
    );
    setShowBillModal(true);
  };

  const confirmGenerateBill = async (prescription) => {
    try {
      const patientId = prescription.patientId?._id;
      const checkupId = prescription.checkupId?._id;

      const items = billDetails.map((item, index) => ({
        name: item.name,
        quantity: updatedQuantities[index],
        price: item.price,
      }));

      const totalAmount = items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      const res = await axios.post(
        `https://aup-patient-first.vercel.app//prescriptions/sendBilling/${patientId}`,
        {
          checkupId,
          department: "Pharmacy",
          items,
          totalAmount,
        }
      );

      if (res.status === 201) {
        alert("Billing created successfully!");
      }
    } catch (error) {
      console.error("Error creating billing:", error);
      alert("Error creating billing. Please check the console for details.");
    } finally {
      setShowBillModal(false);
    }
  };

  const handleQuantityChange = (index, value) => {
    const parsed = parseInt(value);
    setUpdatedQuantities((prev) => ({
      ...prev,
      [index]: isNaN(parsed) ? "" : parsed, // allow blank value
    }));
  };

  return (
    <div>
      <Sidebar
        links={pharmasidebarLinks}
        pageContent={
          <Container className="mt-4">
            <h1 className="mb-4">Prescription Lookup</h1>
            <Form className="mb-4">
              <Row>
                <Col md={8} className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Search by Patient ID, Name, or Visit ID"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </Col>
                <Col md={4} className="mb-2">
                  <Button variant="primary" onClick={handleSearch}>
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>

            <div className="mb-4">
              <Button
                variant={
                  selectedStatus === "pending" ? "primary" : "outline-primary"
                }
                className="me-2"
                onClick={() => handleFilterChange("pending")}
              >
                Pending
              </Button>
              <Button
                variant={
                  selectedStatus === "dispensed" ? "primary" : "outline-primary"
                }
                className="me-2"
                onClick={() => handleFilterChange("dispensed")}
              >
                Dispensed
              </Button>
            </div>

            <table className="table mb-4">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Patient Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(filteredPrescriptions) &&
                filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((prescription) => (
                    <tr key={prescription._id}>
                      <td>{prescription.patient?.patient_id}</td>
                      <td>
                        {prescription.patient
                          ? `${prescription.patient?.firstname} ${prescription.patient?.lastname}`
                          : "Unknown"}
                      </td>
                      <td>{prescription.checkup?.patientType}</td>
                      <td>
                        <span
                          className={`badge ${
                            prescription.status === "pending"
                              ? "bg-warning"
                              : "bg-info"
                          }`}
                        >
                          {prescription.status}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="info"
                          onClick={() => setSelectedPrescription(prescription)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No prescriptions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {selectedPrescription && (
              <div className="mt-4">
                <h2 className="mb-3">Prescription Details</h2>
                <Button
                  variant="secondary"
                  className="mb-3"
                  onClick={() => setSelectedPrescription(null)}
                >
                  Close
                </Button>

                {/* Loop through medications in the prescription */}
                {selectedPrescription.prescriptions?.map((med, index) => (
                  <div key={index} className="mb-3">
                    <p>
                      <strong>Medication:</strong> {med.medication}
                    </p>
                    <p>
                      <strong>Dosage:</strong> {med.dosage}
                    </p>
                    <p>
                      <strong>Instructions:</strong> {med.instruction}
                    </p>
                  </div>
                ))}

                <p>
                  <strong>Checkup Details:</strong>{" "}
                  {selectedPrescription.checkupId?.additionalNotes || "N/A"}
                </p>

                {selectedPrescription.status === "pending" && (
                  <>
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() =>
                        handleConfirmDispense(selectedPrescription._id)
                      }
                    >
                      Mark as Dispensed
                    </Button>
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => handleGenerateBill(selectedPrescription)}
                    >
                      Generate Bill
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={cancelDispense}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Dispense</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to mark this prescription as dispensed?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cancelDispense}>
                  Cancel
                </Button>
                <Button variant="success" onClick={confirmDispense}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Bill Confirmation Modal */}
            <Modal show={showBillModal} onHide={() => setShowBillModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Bill Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billDetails.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>
                          <input
                            type="number"
                            value={updatedQuantities[index] ?? ""}
                            onChange={(e) =>
                              handleQuantityChange(index, e.target.value)
                            }
                          />
                        </td>
                        <td>{item.price * updatedQuantities[index]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>
                  <strong>Total Amount:</strong>{" "}
                  {billDetails.reduce(
                    (total, item, index) =>
                      total + item.price * updatedQuantities[index],
                    0
                  )}
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowBillModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  onClick={() => confirmGenerateBill(selectedPrescription)}
                >
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
          </Container>
        }
      />
    </div>
  );
};

export default Prescriptions;
