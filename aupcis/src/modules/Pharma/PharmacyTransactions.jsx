import React, { useState, useEffect } from "react";
import "./PharmacyTransactions.css";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Modal from "../../components/Modal";
import io from "socket.io-client";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Button,
} from "react-bootstrap";

const socket = io("wss://localhost:3000", {
  secure: true,
  transports: ["websocket"],
  withCredentials: true, // Ensure cookies and authentication headers are sent
});
const PharmacyTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState([]);
  const [transactionType, setTransactionType] = useState("Sold");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [queueNo, setQueueNo] = useState("");
  const [currentQueueStatus, setCurrentQueueStatus] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");
  const [medicineResults, setMedicineResults] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [queueNo_id, setQueueNo_id] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTimer, setModalTimer] = useState(5); // Timer in seconds
  const [queueStatus, setQueueStatus] = useState("waiting"); // Default status
  const [queueData, setQueueData] = useState([]); // State to hold the queue data
  const [waitingQueueData, setWaitingQueueData] = useState([]); // State to hold the waiting queue data
  const [toCashierData, setToCashierData] = useState([]); // State to hold the sent to cashier data
  const [forDispense, setForDispense] = useState([]); // State to hold the dispensed queue data
  const [queueDispenseNo, setQueueDispenseNo] = useState([]);
  const [notification, setNotification] = useState(""); // Add this state
  const [notificationTimer, setNotificationTimer] = useState(0); // Timer for notification

  // for websocket connection
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });
    // Emit to join the department-specific room
    const department = "pharmacy"; // You can dynamically set this based on the department the user is associated with
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

  useEffect(() => {
    fetchTransactions();
    fetchMedicines();
  }, []);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setInterval(() => {
        setModalTimer((prev) => {
          if (prev <= 1) {
            setShowSuccessModal(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showSuccessModal]);

  // Effect to auto-clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      setNotificationTimer(5);
      const interval = setInterval(() => {
        setNotificationTimer((prev) => {
          if (prev <= 1) {
            setNotification("");
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [notification]);

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(
        `https://aup-patientfirst-server.onrender.com/patientname/${patientId}`
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
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "https://aup-patientfirst-server.onrender.com/api/pharma/transactions"
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  //ferch all the queues along with the object id
  const fetchQueue = async () => {
    try {
      const response = await axios.get(`https://aup-patientfirst-server.onrender.com/queue/waiting`, {
        params: { department: "pharmacy" },
      });

      const waitList = response.data;
      console.log("Waiting Queue Response:", waitList);

      setWaitingQueueData(waitList);
      setQueueNo(waitList[0]?.queueNumber); // Set the queue number from the first item
      setQueueNo_id(waitList[0]?._id); // Set the queue ID from the first item

      const sendToCashierData = await axios.get(
        `https://aup-patientfirst-server.onrender.com/queue/sentToCashier`,
        {
          params: { department: "pharmacy" },
        }
      );

      const billList = sendToCashierData.data;
      console.log("To Cashier Queue Response:", billList);

      setToCashierData(billList);

      const dispenseData = await axios.get(
        `https://aup-patientfirst-server.onrender.com/queue/dispensed`,
        {
          params: { department: "pharmacy" },
        }
      );

      const dispenseList = dispenseData.data;
      console.log("Dispense Queue Response:", dispenseList);
      setForDispense(dispenseList);
      setQueueDispenseNo(dispenseList[0]?.queueNumber);
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  };

  useEffect(() => {
    fetchQueue(); // Fetch queue data on component mount
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(
        "https://aup-patientfirst-server.onrender.com/api/pharma/medicines"
      );
      setMedicines(response.data.medicines);
    } catch (error) {
      console.error("Error fetching medicines", error);
    }
  };

  const handleEmergencyDispenseBill = async () => {
    if (
      !selectedMedicine.length ||
      selectedMedicine.some((med) => !med.quantity || med.quantity <= 0) ||
      (transactionType === "Emergency Dispense" &&
        selectedMedicine.some((med) => !med.price || med.price <= 0))
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const transactionData = {
      patientId: patientData.patient._id,
      type: transactionType,
      items: selectedMedicine.map((med) => ({
        medication: med._id,
        name: med.genericName,
        quantity: parseInt(med.quantity, 10),
        price:
          transactionType === "Emergency Dispense" ? parseFloat(med.price) : 0,
        total:
          transactionType === "Emergency Dispense"
            ? parseFloat(med.price) * parseInt(med.quantity, 10)
            : 0,
      })),
    };

    console.log("Transaction Data:", transactionData);

    try {
      await axios.post(
        `https://aup-patientfirst-server.onrender.com/api/pharma/emergencyDispenceBilling/${patientData.patient._id}`,
        transactionData
      );

      alert("Transaction added successfully!");
      fetchTransactions();
      setShowModal(false);
    } catch (error) {
      console.log(
        "Error in handleEmergencyDispenseBill:",
        error.response?.data || error.message
      );
      alert("Failed to add transaction.");
    }
  };

  const handleTransactionSubmit = async () => {
    if (!queueNo || !transactionType || selectedMedicine.length === 0) {
      let errorMsg = "";
      if (!queueNo) errorMsg += "Queue number is missing.\n";
      if (!transactionType) errorMsg += "Transaction type is required.\n";
      if (selectedMedicine.length === 0)
        errorMsg += "Please select at least one medicine.\n";
      alert(errorMsg.trim() || "Please complete all fields.");
      return;
    }

    // Check for out-of-stock medicines
    const outOfStock = selectedMedicine.find(
      (med) => med.totalQuantityLeft === 0
    );
    if (outOfStock) {
      alert(
        `"${outOfStock.genericName}" is out of stock and cannot be selected.`
      );
      return;
    }

    // Additional validation for medicine quantity and price
    const invalidMedicine = selectedMedicine.find(
      (med) =>
        !med.quantity ||
        med.quantity <= 0 ||
        (transactionType === "Sold" && (!med.price || med.price <= 0))
    );
    if (invalidMedicine) {
      alert(
        "Please enter valid quantity and price for all selected medicines."
      );
      return;
    }

    try {
      // Prepare the items array based on selectedMedicine
      const items = selectedMedicine.map((med) => ({
        type: "medicine",
        name: med.genericNname,
        quantity: parseInt(med.quantity, 10),
        price: transactionType === "Sold" ? parseFloat(med.price) : 0,
        total:
          transactionType === "Sold"
            ? parseFloat(med.price) * parseInt(med.quantity, 10)
            : 0,
      }));

      console.log("Items Array:", items);

      // Prepare transaction data
      const transactionData = {
        queueId: queueNo_id,
        department: "Pharmacy",
        items: items,
      };

      console.log("Transaction Data:", transactionData);

      // Send transaction to backend
      await axios.post(
        "https://aup-patientfirst-server.onrender.com/api/pharma/add-transactions",
        transactionData
      );

      // Update queue status
      const statusToUpdate = "sent-to-cashier";
      const queueRes = await axios.patch(
        `https://aup-patientfirst-server.onrender.com/queue/complete/${queueNo}`,
        { status: statusToUpdate }
      );

      console.log("Queue status updated:", queueRes.data);

      // Success notification and cleanup
      setNotification(""); // Clear notification on success
      setModalMessage(
        `Transaction completed. Queue marked as "${statusToUpdate}"`
      );
      setModalTimer(5); // Reset timer
      setShowSuccessModal(true);
      fetchTransactions();
      setShowModal(false);
    } catch (error) {
      console.error("Error during transaction:", error.response?.data || error);
      // Show backend notification if present
      if (error.response?.data?.notification) {
        setNotification(error.response.data.notification);
      } else {
        setNotification("");
        alert("Something went wrong while processing the transaction.");
      }
    }
  };

  const handleMedicineSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setMedicineSearch(query);
    if (query) {
      try {
        const response = await axios.get(
          `https://aup-patientfirst-server.onrender.com/api/pharma/medicines/search?q=${query}`
        );
        console.log("Search Results:", response.data);
        setMedicineResults(response.data);
      } catch (error) {
        console.error("Error searching medicines", error);
      }
    } else {
      fetchMedicines();
    }
  };

  const handleMedicineSelect = (medicine) => {
    if (!selectedMedicine?.some((med) => med._id === medicine._id)) {
      setSelectedMedicine([...selectedMedicine, medicine]);
    }

    setMedicineSearch(""); // Set the search input to the selected medicine name
    setMedicineResults([]); // Clear the search results
  };

  const handleFilterChange = (status) => {
    setSelectedStatus(status); // No need to fetch here
    // setSelectedPrescription(null); // Close prescription details
  };

  const handleSkipButton = async () => {
    console.log("Skip button clicked.");
    const statusToUpdate = "skipped";
    const queueRes = await axios.patch(
      `https://aup-patientfirst-server.onrender.com/queue/complete/${queueNo}`,
      { status: statusToUpdate }
    );

    console.log("Queue status updated:", queueRes.data);
  };

  const handleDoneButton = async () => {
    console.log("Skip button clicked.");
    const statusToUpdate = "done";
    const queueRes = await axios.patch(
      `https://aup-patientfirst-server.onrender.com/queue/complete/${queueDispenseNo}`,
      { status: statusToUpdate }
    );

    console.log("Queue status updated:", queueRes.data);
  };

  const pharmasidebarLinks = [
    { label: "Pharmacy Dashboard", path: "/pharma-dashboard" },
    { label: "Medicine List", path: "/medicine-list" },
    { label: "Pharmacy Transaction", path: "/pharma-transaction" },
    { label: "InPatient Transaction", path: "/prescription-page" },
    { label: "Analytics and Reports", path: "/pharma-analytics" },
  ];

  return (
    <div className="d-flex flex-column flex-md-row">
      <Sidebar
        links={pharmasidebarLinks}
        pageContent={
          <div className="container mt-4">
            <Container className="d-flex justify-content-evenly mb-4">
              <Card>
                <CardHeader>
                  <div
                    className={
                      waitingQueueData[0]?.status === "waiting" ? "flash" : ""
                    }
                  >
                    Queue No: {waitingQueueData[0]?.queueNumber}
                  </div>
                </CardHeader>
                <CardFooter>Status: Next in line</CardFooter>
                <Button variant="outline-primary" onClick={handleSkipButton}>
                  Skip
                </Button>
              </Card>
              <Card>
                <CardHeader>
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
                <Button variant="outline-success" onClick={handleDoneButton}>
                  Done
                </Button>
              </Card>
            </Container>

            <h2 className="text-center">Pharmacy Transactions</h2>
            <button
              className="btn btn-primary mb-3"
              onClick={() => setShowModal(true)}
            >
              Add Transaction
            </button>

            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Medicine</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Date</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td>{tx.medication?.genericName}</td>
                      <td>{tx.type}</td>
                      <td>{tx.quantity}</td>
                      <td>
                        {new Date(tx.transactionDate).toLocaleDateString()}
                      </td>
                      <td>{tx.type === "Sold" ? `₱${tx.price}` : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Transaction Modal */}
            {showModal && (
              <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                style={{
                  maxWidth: "90%",
                  width: "auto",
                  height: "auto",
                  maxHeight: "90%",
                  overflow: "auto",
                  margin: "auto",
                }}
                body={
                  <>
                    <div className="p-3">
                      {/* Notification display */}
                      {notification && (
                        <div className="alert alert-warning text-center mb-3">
                          {notification}
                          {notificationTimer > 0 && (
                            <span style={{ marginLeft: 8, fontSize: "0.9em" }}>
                              (Closing in {notificationTimer}s)
                            </span>
                          )}
                        </div>
                      )}
                      <div className="modal-header">
                        <h3>
                          Pharmacy Transaction for Patient{" "}
                          {waitingQueueData[0].queueNumber}
                        </h3>
                      </div>

                      <div className="modal-body">
                        <h4>Search for medicine</h4>
                        <input
                          type="text"
                          value={medicineSearch}
                          onChange={handleMedicineSearch}
                          placeholder="Paracetamol..."
                          className="form-control mb-3"
                        />

                        {medicineResults.length > 0 && (
                          <ul
                            className="list-group mb-3"
                            style={{
                              maxHeight: "150px",
                              overflowY: "scroll",
                              cursor: "pointer",
                            }}
                          >
                            {medicineResults.map((medicine) => (
                              <li
                                key={medicine._id}
                                className="list-group-item"
                                onClick={() => {
                                  handleMedicineSelect(medicine);
                                }}
                              >
                                <strong>{medicine.genericName}</strong>{" "}
                                <span style={{ color: "#888" }}>
                                  - {medicine.brand}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {selectedMedicine?.length > 0 && (
                        <div className="mb-3">
                          <h4>Selected Medicine</h4>
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Medicine Name</th>
                                  <th>Brand</th>
                                  <th>Price (₱)</th>
                                  <th>Total Quantity Left</th>
                                  <th>Quantity</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedMedicine.map((medicine, index) => (
                                  <tr key={medicine._id}>
                                    <td>{medicine.genericName}</td>
                                    <td>{medicine.brand}</td>
                                    <td>{medicine.price}</td>
                                    <td>{medicine.totalQuantityLeft}</td>
                                    <td>
                                      <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        max={medicine.totalQuantityLeft}
                                        value={medicine.quantity || ""}
                                        onChange={(e) => {
                                          const updatedMedicines = [
                                            ...selectedMedicine,
                                          ];
                                          updatedMedicines[index].quantity =
                                            parseInt(e.target.value, 10) || 0;
                                          setSelectedMedicine(updatedMedicines);
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                          setSelectedMedicine(
                                            selectedMedicine.filter(
                                              (med) =>
                                                med._id !== medicine._id
                                            )
                                          )
                                        }
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="mb-3">
                            <h5>
                              Total Price: ₱
                              {selectedMedicine.reduce(
                                (total, medicine) =>
                                  total +
                                  (medicine.price || 0) *
                                    (medicine.quantity || 0),
                                0
                              )}
                            </h5>
                          </div>

                          <select
                            className="form-control mb-3"
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                          >
                            <option value="Sold">Sell</option>

                            <option value="Emergency Dispense">
                              Emergency Dispense
                            </option>
                          </select>

                          {transactionType === "Emergency Dispense" && (
                            <div className="mb-3">
                              <h4>Search for Patient</h4>

                              <Form
                                className="mb-3"
                                onSubmit={(e) => {
                                  e.preventDefault(); // Prevent default form submission
                                  fetchPatientData(); // Trigger patient data fetch
                                }}
                              >
                                <Form.Group controlId="patientSearch">
                                  <Form.Label>Patient ID</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Patient ID"
                                    value={patientId}
                                    onChange={(e) =>
                                      setPatientId(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault(); // Prevent default Enter key behavior
                                        fetchPatientData(); // Trigger patient data fetch
                                      }
                                    }}
                                  />
                                </Form.Group>
                                <button
                                  className="btn btn-primary"
                                  type="submit"
                                >
                                  Search
                                </button>
                              </Form>

                              {/* Show result ONLY after search */}
                              {patientData && (
                                <div className="mt-3 alert alert-success">
                                  <strong>Patient Found:</strong>{" "}
                                  {patientData.patient?.firstname}{" "}
                                  {patientData.patient?.lastname} (
                                  {patientData.patient?.patient_id})
                                </div>
                              )}
                              {patientData === null && patientId && (
                                <div className="mt-3 alert alert-danger">
                                  <strong>No Patient Found</strong>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="d-flex justify-content-between">
                            {transactionType === "Sold" && (
                              <button
                                className="btn btn-outline-success"
                                onClick={() => {
                                  handleTransactionSubmit();
                                  // alert(
                                  //   "Sell transaction submitted successfully!"
                                  // );
                                }}
                              >
                                Generate Bill
                              </button>
                            )}
                            {transactionType === "Emergency Dispense" && (
                              <button
                                className="btn btn-secondary"
                                onClick={() => {
                                  handleEmergencyDispenseBill();
                                  alert(
                                    "Emergency Dispense Bill generated successfully!"
                                  );
                                }}
                              >
                                Generate Emergency Dispense Bill
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ...existing modal content... */}

                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </>
                }
              />
            )}
            {showSuccessModal && (
              <Modal
                show={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                body={
                  <div className="text-center">
                    <h4>{modalMessage}</h4>
                    <p>Closing in {modalTimer} seconds...</p>
                  </div>
                }
              />
            )}
          </div>
        }
      />
    </div>
  );
};

export default PharmacyTransactions;
