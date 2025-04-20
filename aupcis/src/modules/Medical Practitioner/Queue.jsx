import React from "react";
import { useState } from "react";
import { Button, Modal, Card, Container, Row, Col } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const Queue = () => {
  const [openModal, setOpenModal] = useState(false);
  const [queueNo, setQueueNo] = useState(null);

  const handleGenerateQueue = () => {
    setQueueNo(Math.floor(1000 + Math.random() * 9999));
    setOpenModal(true);
  };

  const navlinks = [
    {
      label: "About",
      path: "/",
    },
    {
      label: "Services",

      path: "/services",
    },
    {
      label: "Log In",
      path: "/login-register",
    },
  ];

  return (
    <div>
      <Navbar myProps={navlinks} />
      <div
        style={{
          background: "linear-gradient(to bottom,rgba(252, 253, 255, 0.87),rgb(222, 214, 214))",
          minHeight: "100vh",
          color: "#333",
        }}
      >
        <Container className="mt-4">
          <Row className="g-4">
            {["Cashier", "Laboratory", "Doctor", "Pharmacy", "X-Ray"].map(
              (department) => (
                <Col key={department} md={4}>
                  <Card
                    className="bg-light"
                    style={{
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
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
                          transition: "background-color 0.2s, transform 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#0056b3";
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#007bff";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        onClick={handleGenerateQueue}
                      >
                        Generate Queue Number
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              )
            )}
          </Row>
        </Container>

        <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Your Unique Queue Number</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h1 className="text-center">{queueNo}</h1>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Queue;
