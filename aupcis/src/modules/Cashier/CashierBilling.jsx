import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Table,
} from "react-bootstrap";
import Sidebar from "../../components/Sidebar";

const CashierBilling = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [billingDetails, setBillingDetails] = useState(null);

  const handleSearch = () => {
    // Mock data for demonstration
    const mockData = {
      123: { name: "John Doe", amount: "$200", date: "2023-10-01" },
      456: { name: "Jane Smith", amount: "$150", date: "2023-10-02" },
    };

    const result = mockData[searchQuery] || null;
    setBillingDetails(result);
  };

  const cashierSidebarLinks = [
    {
      label: "Cashier Dashboard",
      path: "/cashier-dashboard",
    },
    {
      label: "Transaction",
      path: "/",
    },
    {
      label: "Billing",
      path: "/cashier-billing",
    },
  ];

  return (
    <Sidebar
      links={cashierSidebarLinks}
      pageContent={
        <>

         {/* Card for searching the patient  */}
          <Container className="mt-4">
            <h1 className="mt-4">Cashier</h1>
            <Card className="mt-4 p-4">
              <h2>Search Patient Billing</h2>
              <Form className="d-flex mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter Patient Name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="me-2"
                />
                <Button variant="primary" onClick={handleSearch}>
                  Search
                </Button>
              </Form>
              {/* {billingDetails ? (
                <Card className="p-3">
                  <h3>Billing Details</h3>
                  <p>
                    <strong>Name:</strong> {billingDetails.name}
                  </p>
                  <p>
                    <strong>Amount:</strong> {billingDetails.amount}
                  </p>
                  <p>
                    <strong>Date:</strong> {billingDetails.date}
                  </p>
                </Card>
              ) : (
                searchQuery && (
                  <Alert variant="warning">
                    No billing details found for the entered ID or name.
                  </Alert>
                )
              )} */}
            </Card>
          </Container>
          {/* Card for showing the bill of the patient  */}
          <Container className="mt-4">
          <Card className="mt-4 p-4">
            <h5>Generated Billing</h5>
            <Card.Body>
          <Card.Title>
            Billing for: Lloyd (ID: 2051068)
          </Card.Title>
          {/* Table as shown above */}

          <Table responsive bordered hover className="mt-3">
      <thead>
        <tr>
          <th>Service</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total Price</th>
          <th>Department</th>
          <th>Date</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      </Table>
        </Card.Body>
          </Card>
          </Container>
        </>
      }
    />
  );
};

export default CashierBilling;
