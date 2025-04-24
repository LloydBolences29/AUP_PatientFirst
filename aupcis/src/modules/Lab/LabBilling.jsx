import React from "react";
import { useState , useEffect} from "react";
import Sidebar from "../../components/Sidebar";
import { Container, Row, Col, Button, Form,CardHeader,Table, Modal, Card, CardFooter } from "react-bootstrap";
import axios from "axios";
import io from "socket.io-client";
import "../Pharma/PharmacyTransactions.css";

const socket = io("wss://localhost:3000", {
  secure: true,
  transports: ["websocket"],
  withCredentials: true, // Ensure cookies and authentication headers are sent
});



const LabBilling = () => {
  const [tests, setTests] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [selectedTest, setSelectedTest] = useState([]);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [waitingQueueData, setWaitingQueueData] = useState([]); // State to hold the waiting queue data
    const [toCashierData, setToCashierData] = useState([]); // State to hold the sent to cashier data
    const [forDispense, setForDispense] = useState([]); // State to hold the dispensed queue data
    const [queueNo, setQueueNo] = useState("")
  const [queueDispenseNo, setQueueDispenseNo] = useState([])


useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });
    // Emit to join the department-specific room
    const department = "lab"; // You can dynamically set this based on the department the user is associated with
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
      const response = await axios.get(`https://aup-patient-first.vercel.app/queue/waiting`, {
        params: { department: "lab" }});
  
      const waitList = response.data;
      console.log("Waiting Queue Response:", waitList);
  
      setWaitingQueueData(waitList);
      setQueueNo(waitList[0]?.queueNumber); // Set the queue number from the first item

      const sendToCashierData = await axios.get(
        `https://aup-patient-first.vercel.app/queue/sentToCashier`, {
          params: { department: "lab" }});

          const billList = sendToCashierData.data;
          console.log("To Cashier Queue Response:", billList);

          setToCashierData(billList);

          const dispenseData = await axios.get(
            `https://aup-patient-first.vercel.app/queue/dispensed`, {
              params: { department: "lab" }});

              const dispenseList = dispenseData.data;
              console.log("Dispense Queue Response:", dispenseList);
              setForDispense(dispenseList);
              setQueueDispenseNo(dispenseList[0]?.queueNumber)

        

  
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  };

    useEffect(() => {
      fetchQueue(); // Fetch queue data on component mount
    }, []);

  const handleSearch = async () => {
    // Implement search logic here
    if (searchTerm.trim() !== "") {
      try {
        const response = await axios.get(
          `https://aup-patient-first.vercel.app/labTest/getLabTest/${searchTerm}`
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

  //fetch the patient data
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `https://aup-patient-first.vercel.app/patientname/${patientId}`
        );
        if (response.data) {
          setPatientData(response.data);
        } else {
          setPatientData(null);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);             
        setPatientData(null);
      }
    };

    const calculateTotal = () => {
      return selectedTest.reduce((total, proc) => {
        let price = proc.price;
    
        // Remove any ₱ or $ and convert to number
        if (typeof price === "string") {
          price = parseFloat(price.replace(/[₱$]/g, ''));
        }
    
        return total + (isNaN(price) ? 0 : price);
      }, 0);
    };
    

    const removeTest = (index) => {
      setSelectedTest((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
      console.log("Fetched patientData:", selectedTest);
    }, [selectedTest]);

    const addTest = (proc) => {
      setSelectedTest((prev) => [...prev, proc]);
    };

    const handleGenerateBill = async () => {
      try {
        const response = await axios.post(
          `https://aup-patient-first.vercel.app/labTest/sendLabBilling/${patientId}`,
          {
            items: selectedTest,
          }
        );

        // Update queue status
      const statusToUpdate = "sent-to-cashier";
      const queueRes = await axios.patch(
        `https://aup-patient-first.vercel.app/queue/complete/${queueNo}`,
        { status: statusToUpdate }
      );
    
      console.log("Queue status updated:", queueRes.data);

        console.log("Billing sent successfully:", response.data);
        alert("Lab billing created successfully!");
      } catch (error) {
        console.error("Error sending billing:", error);
        alert("Failed to create Lab billing: " + error?.response?.data?.message);
      }
  setShowModal(false); // Close the modal after generating the bill
  
    };

    const handleSkipButton = async () => {
          console.log("Skip button clicked.");
          const statusToUpdate = "skipped";
            const queueRes = await axios.patch(
              `https://aup-patient-first.vercel.app/queue/complete/${queueNo}`,
              { status: statusToUpdate }
            );
      
            console.log("Queue status updated:", queueRes.data);
          }
      
          const handleDoneButton = async () => {
            console.log("Done button clicked.");
            const statusToUpdate = "done";
              const queueRes = await axios.patch(
                `https://aup-patient-first.vercel.app/queue/complete/${queueDispenseNo}`,
                { status: statusToUpdate }
              );
        
              console.log("Queue status updated:", queueRes.data);
            }
    
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


            <Container className="d-flex justify-content-evenly mb-4">
              <Card>
                <CardHeader>
                
                  <div
                    className={waitingQueueData[0]?.status === "waiting" ? "flash" : ""}
                  >
                    Queue No: {waitingQueueData[0]?.queueNumber}
                  </div>
                </CardHeader>
                <CardFooter>Status: Next in line</CardFooter>
               <Button variant="outline-primary"
                               onClick={handleSkipButton}>
                                 Skip
                               </Button>
              </Card>
              <Card>
                <CardHeader>
                  <div
                    className={
                      toCashierData[0]?.status === "sent-to-cashier" ? "flash" : ""
                    }
                  >
                    Queue No: {toCashierData[0]?.queueNumber}
                  </div>
                </CardHeader>
                <CardFooter>Status: Sent to Cashier</CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div
                    className={
                      forDispense[0]?.status === "dispensing" ? "flash" : ""
                    }
                  >
                    Queue No: {forDispense[0]?.queueNumber}
                  </div>
                </CardHeader>
                <CardFooter>Status: For Dispensing</CardFooter>
              <Button variant="outline-success"
                              onClick={handleDoneButton}>
                                Done
                              </Button>
              </Card>
            </Container>

            <Container fluid className="p-0 bg-light">
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
                <Col md={12} className="bg-white shadow-sm p-4 rounded mx-0">
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
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tests.map((test, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{test.name}</td>
                              <td>₱{test.price}</td>
                              <td><Button variant="success"
                                    size="sm"
                                    onClick={() => addTest(test)}
                                  >Add</Button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No tests found.</p>
                  )}
                </Col>

                <Col md={6} className="bg-white shadow-sm p-4 rounded mx-0">
                  <CardHeader className="fw-bold text-primary">
                    Search Patient by ID
                  </CardHeader>
                  <Form
                    className="mt-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      fetchPatientData();
                    }}
                  >
                    <Form.Group controlId="patientSearch">
                      <Form.Label className="fw-bold">Patient ID</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Patient ID"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="mb-2"
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Search
                    </Button>
                  </Form>
                  


                  {patientData ? (
                    <div className="mt-4">
                      <h5 className="text-success">Patient Information</h5>
                      <Table striped bordered hover>
                        <tbody>
                          <tr>
                            <td className="fw-bold">Patient ID</td>
                            <td>{patientData.patient.patient_id}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Name</td>
                            <td>{patientData.patient.firstname}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Gender</td>
                            <td>{patientData.patient.gender}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    patientId && (
                      <p className="text-danger mt-3">Patient not found.</p>
                    )
                  )}
                  </Col>
                  <Col md={6} className="bg-white shadow-sm p-4 rounded mx-0">
                  <CardHeader className="fw-bold text-primary">
                    Selected Test/s
                  </CardHeader>
                  {selectedTest.length > 0 && patientData ? (
                    <div>
                      <h5 className="text-success">Bill Details</h5>
                      <Table striped bordered hover className="mt-4">
                        <thead className="table-primary">
                          <tr>
                            <th>Test Name</th>
                            <th>Price</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTest.map((proc, index) => (
                            <tr key={index}>
                              <td>{proc.name}</td>
                              <td>{proc.price}</td>
                              <td>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => removeTest(index)}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <h5 className="mt-3">
                        Total: ₱{calculateTotal().toFixed(2)}
                      </h5>
                      <Button
                        variant="success"
                        className="mt-3"
                        onClick={() => setShowModal(true)}
                      >
                        Generate Bill
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted mt-3">
                      {selectedTest.length === 0
                        ? "No procedures selected."
                        : "Please search for a patient to generate the bill."}
                    </p>
                  )}
                </Col>
              </Row>
            </Container>

             {/* Modal for Bill Confirmation */}
                        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                          <Modal.Header closeButton>
                            <Modal.Title>Confirm Billing</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <h5>Patient Information</h5>
                            <Table striped bordered hover>
                              <tbody>
                                <tr>
                                  <td className="fw-bold">Patient ID</td>
                                  <td>{patientData?.patient?.patient_id}</td>
                                </tr>
                                <tr>
                                  <td className="fw-bold">Name</td>
                                  <td>{patientData?.patient?.firstname}</td>
                                </tr>
                                <tr>
                                  <td className="fw-bold">Gender</td>
                                  <td>{patientData?.patient?.gender}</td>
                                </tr>
                              </tbody>
                            </Table>
                            <h5 className="mt-4">Selected Test</h5>
                            <Table striped bordered hover>
                              <thead>
                                <tr>
                                  <th>Test Name</th>
                                  <th>Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedTest.map((proc, index) => (
                                  <tr key={index}>
                                    <td>{proc.name}</td>
                                    <td>{proc.price}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                            <h5 className="mt-3">Total: ₱{calculateTotal().toFixed(2)}</h5>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                              Cancel
                            </Button>
                            <Button variant="success" onClick={handleGenerateBill}>
                              Confirm and Generate Bill
                            </Button>
                          </Modal.Footer>
                        </Modal>
          </>
        }
      />
    </div>
  );
};

export default LabBilling;
