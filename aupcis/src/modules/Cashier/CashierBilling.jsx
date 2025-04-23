import React, { useState, useEffect } from "react";
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
  CardHeader,
  CardFooter,
} from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import io from "socket.io-client";
import "../Pharma/PharmacyTransactions.css";

const socket = io("wss://localhost:3000", {
  secure: true,
  transports: ["websocket"],
  withCredentials: true, // Ensure cookies and authentication headers are sent
});

const CashierBilling = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [billingDetails, setBillingDetails] = useState([]); // Initialize as an empty array});
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash"); // Default payment method
  const [toCashierData, setToCashierData] = useState([]);
  const [forDispense, setForDispense] = useState([]);
  const [queueNo, setQueueNo] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });
    // Emit to join the department-specific room
    const department = "cashier"; // You can dynamically set this based on the department the user is associated with
    socket.emit("joinDepartmentRoom", department);

    // Listen for 'queueGenerated' event to update the frontend
    socket.on("queueGenerated", (data) => {
      if (data.department === department) {
        console.log(
          "New Queue Generated for " + department + ": ",
          data.queueNumber
        );

        console.log("Queue Number:", queueNo); // Log the queue number

        // Update the queue number in the state
      }
    });
    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off("queueGenerated");
    };
  }, [queueNo]);

  useEffect(() => {
    socket.on("queueStatusUpdate", (data) => {
      console.log("Queue status updated via socket:", data);

      // Optionally, update local state or refetch the queue
      fetchQueue(); // or handle data accordingly
    });

    // Cleanup the listener to prevent duplicates
    return () => {
      socket.off("queueStatusUpdate");
    };
  }, []);

  const fetchQueue = async () => {
    try {
      const sendToCashierData = await axios.get(
        `https://localhost:3000/queue/sentToCashier`,
        {
          params: {
            department: ["pharmacy", "cashier", "lab", "xray", "consultation"],
          },
        }
      );

      const billList = sendToCashierData.data;
      console.log("To Cashier Queue Response:", billList);

      setToCashierData(billList);
      setQueueNo(billList[0].queueNumber);

      const dispenseData = await axios.get(
        `https://localhost:3000/queue/dispensed`,
        {
          params: {
            department: ["pharmacy", "cashier", "lab", "xray", "consultation"],
          },
        }
      );

      const dispenseList = dispenseData.data;
      console.log("Dispense Queue Response:", dispenseList);
      setForDispense(dispenseList);
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  };

  useEffect(() => {
    fetchQueue(); // Fetch queue data on component mount
  }, []);

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

  const handlePayment = async () => {
    try {
      console.log(
        "Billing IDs to update:",
        billingDetails.map((b) => b._id)
      );

      for (const bill of billingDetails) {
        await axios.put(`https://localhost:3000/billing/update/${bill._id}`, {
          modeOfPayment: paymentMethod,
        });
      }

      // Update queue status
      const statusToUpdate = "dispensing";
      const queueRes = await axios.patch(
        `https://localhost:3000/queue/complete/${queueNo}`,
        { status: statusToUpdate }
      );

      console.log("Queue status updated:", queueRes.data);

      alert("Payment successful!");
      setShowModal(false);
      setBillingDetails([]); // Clear the billing view
      setSearchQuery(""); // Optional: reset search
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred while processing the payment.");
    }
  };

  const cashierSidebarLinks = [
    {
      label: "Cashier Dashboard",
      path: "/cashier-dashboard",
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
            <Container>
                        <Card md={9} className="content-column analytics-card shadow-sm p-3 bg-white rounded text-center">
                                        <div className="page-content">
                                          <h1
                                            className="page-title fw-bold"
                                            style={{ color: "#2c3e50" }}
                                          >
                                          Cashier Billing
                                          </h1>
                                          
                                        </div>
                                      </Card>
              <Card className="mt-4 p-4">
                <Container className="d-flex justify-content-evenly mb-4">
                  <Card>
                    <CardHeader className="text-center">
                      <div
                        className={
                          toCashierData[0]?.status === "sent-to-cashier"
                            ? "flash"
                            : ""
                        }
                      >
                        Queue No: {toCashierData[0]?.queueNumber}
                      </div>
                    </CardHeader>
                    <CardFooter className="text-center">
                      Status: Payment
                    </CardFooter>
                  </Card>
                </Container>

                <h2>Search Patient Billing</h2>
                <Form
                  className="d-flex mb-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter Patient ID, Name or Queue Number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="me-2"
                  />
                  <Button variant="primary" type="submit">
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
                        Billing for: {billingDetails[0].patientId?.firstname}{" "}
                        {billingDetails[0].patientId?.lastname} (ID:{" "}
                        {billingDetails[0].patientId?.patient_id}) {queueNo}
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
            {totalDue.toFixed(2)}?
          </p>
          <Form.Group controlId="paymentMethod" className="mt-3">
            <Form.Label>Select Payment Method</Form.Label>
            <Form.Control
              as="select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="gcash">GCash</option>
              <option value="bank-transfer">Bank Transfer</option>
              <option value="charge-to-account">Charge to Account</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleModalClose();
              handlePayment();
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
