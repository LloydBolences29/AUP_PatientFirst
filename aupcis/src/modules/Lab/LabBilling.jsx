import React from "react";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import axios from "axios";

const LabBilling = () => {
  const [tests, setTests] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    // Implement search logic here
    if (searchTerm.trim() !== "") {
      try {
        const response = await axios.get(
          `https://localhost:3000/labTest/getLabTest/${searchTerm}`
        );
        setTests(response.data);
        setError("");
      } catch (error) {
        setTests(null); // Set procedure to null if error occurs
        setError("Category not found or an error occurred.");
        console.error("Error fetching procedure:", error);
      }
    }
  };

  const labSidebarLinks = [
    { label: "Dashboard", path: "/lab-dashboard" },
    { label: "Billing", path: "/lab-billing" },
    { label: "Upload", path: "/lab-upload" },
  ];
  return (
    <div>
      <Sidebar
        links={labSidebarLinks}
        pageContent={
          <>
            <Container fluid className="p-0">
              <Row>
                <Col className="mt-4 d-flex justify-content-center align-items-center">
                  <h1>Lab Billing</h1>
                </Col>
              </Row>
            </Container>

            <Container fluid className="p-4 bg-light">
              <Row>
                <Col md={12} className="bg-white shadow-sm p-4 rounded mx-auto">
                  <Form
                    className="mb-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Handle form submission here
                      handleSearch();
                    }}
                  >
                    <Form.Group controlId="search">
                      <Form.Label>Search</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter search term"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Form.Text className="text-muted">
                        Search for test category only.
                      </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="mt-3">
                      Search
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Container>

            <Container fluid className="p-0">
              <Row className="mt-4">
                <Col md={12} className="bg-white shadow-sm p-4 rounded mx-auto">
                  {error && <p className="text-danger">{error}</p>}

                  {Array.isArray(tests) && tests.length > 0 ? (
                    <div>
                      <h2>{tests[0]?.category}</h2>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Test Name</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tests.map((test, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{test.name}</td>
                              <td>₱{test.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No tests found.</p>
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

export default LabBilling;
