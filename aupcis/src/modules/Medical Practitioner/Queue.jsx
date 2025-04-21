import React from "react";
import { useState } from "react";
import { Button, Modal, Card, Container, Row, Col } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Queue = () => {
  const [openModal, setOpenModal] = useState(false);
  const [queueNo, setQueueNo] = useState(null);

  const handleGenerateQueue = async (department) => {
    try {
      const response = await axios.post(
        "https://localhost:3000/queue/generateQueue",
        { department: department.toLowerCase() }
      );
      setQueueNo(response.data.queueNumber);
      console.log("Generated:", response.data.queueNumber);
      setOpenModal(true);
    } catch (error) {
      console.error("Error generating queue number:", error);
    }
  };

  const handlePrintQueue = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Queue Number</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f8f9fa;
            }
            .queue-container {
              text-align: center;
              border: 2px solid #007bff;
              padding: 20px;
              border-radius: 10px;
              background-color: #ffffff;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .queue-title {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
            }
            .queue-number {
              font-size: 48px;
              font-weight: bold;
              color: #007bff;
            }
          </style>
        </head>
        <body>
          <div class="queue-container">
            <div class="queue-title">Your Queue Number</div>
            <div class="queue-number">${queueNo}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const nurseSidebarLinks = [
    {
      label: "Dashboard",
      path: "/nurse-dashboard",
    },
    {
      label: "Patient Management",
      path: "/patient-management",
    },
  ];

  return (
    <div>
      <Sidebar
        links={nurseSidebarLinks}
        pageContent={
          <>
            <div
              style={{
                background:
                  "linear-gradient(to bottom,rgba(252, 253, 255, 0.87),rgb(222, 214, 214))",
                minHeight: "100vh",
                color: "#333",
              }}
            >
              <Container className="mt-4">
                <Row className="g-4">
                  {[
                    "Cashier",
                    "Laboratory",
                    "Consultation",
                    "Pharmacy",
                    "X-Ray",
                  ].map((department) => (
                    <Col key={department} md={4}>
                      <Card
                        className="bg-light"
                        style={{
                          transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 8px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Card.Body>
                          <Card.Title>{department}</Card.Title>
                          <Button
                            variant="primary"
                            style={{
                              transition:
                                "background-color 0.2s, transform 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#0056b3";
                              e.currentTarget.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#007bff";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                            onClick={() => handleGenerateQueue(department)}
                          >
                            Generate Queue Number
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>

              <Modal
                show={openModal}
                onHide={() => setOpenModal(false)}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Your Unique Queue Number</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <h1 className="text-center">{queueNo}</h1>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setOpenModal(false)}
                  >
                    Close
                  </Button>
                  <Button variant="primary" onClick={handlePrintQueue}>
                    Print
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </>
        }
      />
    </div>
  );
};

export default Queue;
