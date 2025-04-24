import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Card,
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";

const AdminRoleManagement = () => {
  const sidebarLinks = [
    {
      label: "Admin Dashboard",
      path: "/admin-dashboard",
    },

    {
      label: "Admin Management ",
      path: "/admin-management",
    },
    {
      label: "Pharmacy Analytics ",
      path: "/pharmacyAnalytics",
    },
  ];

  const [formData, setFormData] = useState({
    role_ID: "",
    password: "",
    fullname: "",
    address: "",
    city: "",
    role: "",
    zip: "",
  });

  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      const response = await fetch("https://aup-patient-first.vercel.app/api/roles/user");

      try {
        const data = await response.json(); // ✅ Read response only once
        console.log("Parsed JSON:", data);
      } catch (error) {
        console.error("Response is not JSON:", error);
      }
    };
    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting FormData:", formData); // Debugging
    const response = await fetch("https://aup-patient-first.vercel.app/api/roles/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const text = await response.text(); // Read raw response
    console.log("Raw response:", text);

    try {
      const data = JSON.parse(text); // Try parsing as JSON
      console.log("Parsed JSON:", data);
      if (response.ok) {
        setNotification("User added successfully!");
      } else {
        setNotification("Failed to add user.");
      }
    } catch (error) {
      console.error("Response is not JSON:", error);
      setNotification("Failed to add user.");
    }

    setTimeout(() => {
      setNotification("");
    }, 3000); // Clear notification after 3 seconds
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        links={sidebarLinks}
        pageContent={
          <Container>
            <Row>
              <Col>
                <Card
                  md={9}
                  className="content-column analytics-card shadow-sm p-3 mb-5 bg-white rounded text-center"
                >
                  <div className="page-content">
                    <h1
                      className="page-title fw-bold"
                      style={{ color: "#2c3e50" }}
                    >
                      Admin Role Management
                    </h1>
                  </div>
                  <Card.Body>
                    <Card.Text>
                      Manage the roles of the users in the system
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                {notification && <Alert variant="info">{notification}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="role_ID">
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="ID"
                          value={formData.role_ID}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="fullname">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Dela Cruz, Juan Miguel, A"
                          value={formData.fullname}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Apartment, studio, or floor"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                          as="select"
                          value={formData.role}
                          onChange={handleChange}
                        >
                          <option value="">Choose...</option>
                          <option value="Nurse">Nurse</option>
                          <option value="Doctor">Doctor</option>
                          <option value="MedicalRecordsOfficer">
                            Medical Records Officer
                          </option>
                          <option value="Pharmacist">Pharmacist</option>
                          <option value="Cashier">Cashier</option>
                          <option value="Admin">Admin</option>
                          <option value="Radiologist">Radiologist</option>
                          <option value="lab">Medical Technologist</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group controlId="zip">
                        <Form.Label>Zip</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.zip}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="mt-4"
                  >
                    Add Role
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        }
      />
    </div>
  );
};

export default AdminRoleManagement;
