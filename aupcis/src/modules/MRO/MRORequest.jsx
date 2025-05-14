import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Container, Row, Col, Table, Button, Card, Modal, Alert } from "react-bootstrap";

const MedicalRecordDashboard = () => {
  const sidebarRef = useRef(null);
  const MROsidebarLinks = [
    { label: "Dashboard", path: "/medicalRecord-dashboard" },
    { label: "Patient Management", path: "/medicalRecord-management" },
    { label: "Request Forms", path: "/request-forms" },
  ];

  const [requests, setRequests] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState({ id: null, status: "" });
  const [notification, setNotification] = useState({ show: false, message: "", variant: "" });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("https://localhost:3000/formRequest/pending");
      console.log("Fetched requests:", res.data);
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`https://localhost:3000/formRequest/${id}`, {
        status: newStatus,
      });
      fetchRequests(); // refresh list
      setNotification({
        show: true,
        message: `Request has been ${newStatus === "Approved" ? "approved" : "rejected"}.`,
        variant: newStatus === "Approved" ? "success" : "danger",
      });
    } catch (err) {
      console.error("Error updating status:", err);
      setNotification({
        show: true,
        message: "There was an error updating the request.",
        variant: "danger",
      });
    }
  };

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleActionClick = (id, status) => {
    setPendingAction({ id, status });
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    if (pendingAction.id && pendingAction.status) {
      await handleStatusChange(pendingAction.id, pendingAction.status);
    }
    setPendingAction({ id: null, status: "" });
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingAction({ id: null, status: "" });
  };

  const formatRequestType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div>
      <Sidebar
        links={MROsidebarLinks}
        ref={sidebarRef}
        pageContent={
          <>
            {/* Notification Alert */}
            {notification.show && (
              <Alert
                variant={notification.variant}
                onClose={() => setNotification({ ...notification, show: false })}
                dismissible
                className="mt-3"
              >
                {notification.message}
              </Alert>
            )}
            <Container fluid className="py-4">
              <Row className="justify-content-center">
                <Col xs={12} md={12} lg={12}>
                  <Card>
                    <Card.Body>
                      <Card.Title as="h2" className="mb-4 text-center">
                        Incoming Form Requests
                      </Card.Title>
                      <div className="table-responsive">
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>Patient ID</th>
                              <th>Request Type(s)</th>
                              <th>Purpose</th>
                              <th>Date Requested</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {requests.map((req) => (
                              <tr key={req._id}>
                                <td>{req.patientId || "Unknown"}</td>
                                <td>{req.requestTypes.map(formatRequestType).join(", ")}</td>
                                <td>{req.purpose}</td>
                                <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                <td>{req.status}</td>
                                <td>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    className="me-2 mb-1"
                                    onClick={() =>
                                      handleActionClick(req._id, "Approved")
                                    }
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="mb-1"
                                    onClick={() =>
                                      handleActionClick(req._id, "Rejected")
                                    }
                                  >
                                    Reject
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
            <Modal show={showConfirm} onHide={handleCancel} centered>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Action</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to{" "}
                <b>
                  {pendingAction.status === "Approved" ? "approve" : "reject"}
                </b>{" "}
                this request?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant={
                    pendingAction.status === "Approved" ? "success" : "danger"
                  }
                  onClick={handleConfirm}
                >
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        }
      />
    </div>
  );
};

export default MedicalRecordDashboard;
