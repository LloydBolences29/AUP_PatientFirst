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
  Modal,
} from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

const CashierBilling = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [billingDetails, setBillingDetails] = useState([]); // Initialize as an empty array});
  const [showModal, setShowModal] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://localhost:3000/billing/billing/search?query=${searchQuery}`
      );

      if (response.data.length > 0) {
        setBillingDetails(response.data);
      } else {
        setBillingDetails([]);
      }
    } catch (error) {
      console.error("Error fetching billing data:", error);
      setBillingDetails([]);
    }
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

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

  const totalDue = billingDetails.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0
  );

  return (
    <>
      <Sidebar
        links={cashierSidebarLinks}
        pageContent={
          <>
            {/* Card for searching the patient  */}
            <Container className="mt-4">
              <Card className="mt-4 p-4">
                <h2>Search Patient Billing</h2>
                <Form
                  className="d-flex mb-3"
                  onSubmit={(e) => {
                    e.preventDefault(); // Prevent default form submission
                    handleSearch();
                  }}
                >
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
            <Container className="mt-4 mb-5">
              <Card className="mt-4 p-4">
                <h5>Generated Billing</h5>
                <Card.Body>
                  {billingDetails.length > 0 ? (
                    <>
                      <Card.Title>
                        Billing for: {billingDetails[0].patientId.firstname}{" "}
                        {billingDetails[0].patientId.lastname} (ID:{" "}
                        {billingDetails[0].patientId.patient_id})
                      </Card.Title>
                      <Table responsive bordered hover className="mt-3">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Service</th>
                            <th>Quantity</th>
                            <th>Department</th>
                            <th>Unit Price</th>
                            <th>Total Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {billingDetails.map((bill, i) =>
                            bill.items.map((item, j) => (
                              <tr key={`${i}-${j}`}>
                                <td>
                                  {new Date(
                                    bill.createdAt
                                  ).toLocaleDateString()}
                                </td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{bill.department}</td>
                                <td>₱{item.price}</td>
                                <td>₱{item.total}</td>
                                <td>₱{bill.totalAmount}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    </>
                  ) : (
                    <Alert variant="warning">
                      {searchQuery
                        ? "No billing records found for the entered ID or name."
                        : "Search for a patient to view billing."}
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Container>

            {/* Sticky footer for total amount due */}
            <div
              className="text-white border-top border-dark position-fixed bottom-0 w-100 d-flex justify-content-center align-items-center"
              style={{
                zIndex: 1000,
                height: "70px",
                backgroundColor: "rgba(44, 62, 80, 1)",
              }}
            >
              <div className="container d-flex justify-content-evenly align-items-center">
                <Card.Text className="mb-0">
                  <strong>Total Amount Due:</strong> ₱{totalDue.toFixed(2)}{" "}
                </Card.Text>
                <div>
                  <Button
                    variant="light"
                    className="me-2"
                    onClick={handleModalShow}
                  >
                    Pay Now
                  </Button>
                </div>
              </div>
            </div>
          </>
        }
      />

      {/* Modal for Payment */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to proceed with the payment of ₱
            {totalDue.toFixed(2)}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleModalClose();
              alert("Payment Successful!");
            }}
          >
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CashierBilling;
