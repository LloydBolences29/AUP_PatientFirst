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
        setError("Procedure not found or an error occurred.");
        console.error("Error fetching procedure:", error);
      }
    }
  };

  const xraySidebarLinks = [
    { label: "Dashboard", path: "/xray-dashboard" },
    { label: "Billing", path: "/xray-billing" },
  ];

  return (
    <div>
      <Sidebar
        links={xraySidebarLinks}
        pageContent={
          <>
            <Container fluid className="p-4 bg-light">
              <Row>
                <Col md={9} className="bg-white shadow-sm p-4 rounded">
                  <h1 className="mb-4 text-primary">X-Ray Billing</h1>
                  <p className="text-muted">
                    Search for procedures and view their details below.
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
                        Search Procedure
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
                      {procedure.Procedures && Array.isArray(procedure.Procedures) ? (
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
              </Row>
            </Container>
          </>
        }
      />
    </div>
  );
};

export default XrayBilling;
