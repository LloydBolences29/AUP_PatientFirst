import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Modal from "../../components/Modal";
import io from "socket.io-client";
import { Form } from "react-bootstrap";

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
  const [queueNo, setQueueNo] = useState(null);
  const [medicineSearch, setMedicineSearch] = useState("");
  const [medicineResults, setMedicineResults] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [queueNo_id, setQueueNo_id] = useState(null);

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
        // You can update the UI he
        setQueueNo(data.queueNumber);

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
    fetchTransactions();
    fetchMedicines();
  }, []);
  console.log("Queue Number:", queueNo); // Log the queue number
  const fetchPatientData = async () => {
    try {
      const response = await axios.get(
        `https://localhost:3000/patientname/${patientId}`
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
        "https://localhost:3000/api/pharma/transactions"
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  //ferch all the queues along with the object id
  const fetchQueue = async (queueNumber) => {
    try {
      const response = await axios.get(
        `https://localhost:3000/queue/queue/${queueNumber}`
      );
      console.log("Queue Number:", queueNo); // Log the queue number
      setQueueNo(response.data.queueNumber);
      return response.data;
    } catch (error) {
      console.error("Error fetching queue", error);
    }
  };

  useEffect(() => {
    if (queueNo) {
      fetchQueue(queueNo).then((queue) => {
        if (queue) {
          setQueueNo_id(queue._id);
          console.log("Queue ID:", queue._id); // Directly log from response
        }
      });
    }
  }, [queueNo]);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(
        "https://localhost:3000/api/pharma/medicines"
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
        name: med.name,
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
        `https://localhost:3000/api/pharma/emergencyDispenceBilling/${patientData.patient._id}`,
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
      alert("Please complete all fields.");
      return;
    }
  
    try {
      // Prepare the items array based on selectedMedicine
      const items = selectedMedicine.map((med) => ({
        type: "medicine",  // Assuming all items are medicines
        name: med.name,    // Correct item name
        quantity: parseInt(med.quantity, 10), // Quantity as integer
        price: transactionType === "Sold" ? parseFloat(med.price) : 0,  // Price only if 'Sold'
        total: transactionType === "Sold" ? parseFloat(med.price) * parseInt(med.quantity, 10) : 0,  // Total amount for each item
      }));
  
      // Ensure the items array is correctly structured
      console.log("Items Array:", items);
  
      // Prepare the data object for the request
      const transactionData = {
        queueId: queueNo_id,  // Queue ID (from your state)
        department: "Pharmacy",  // You can hard-code this or dynamically fetch if needed
        items: items,  // Items array containing the selected medicines and their details
      };
  
      // Log the final data to be sent
      console.log("Transaction Data:", transactionData);
  
      // Send the request to the backend API
      await axios.post("https://localhost:3000/api/pharma/add-transactions", transactionData);
  
      // Notify the user of success
      alert("All transactions added successfully!");
      fetchTransactions();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding transaction", error.response?.data || error);
      alert("Failed to add transaction.");
    }
  };
  

  const handleMedicineSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setMedicineSearch(query);
    if (query) {
      try {
        const response = await axios.get(
          `https://localhost:3000/api/pharma/medicines?search=${query}`
        );
        setMedicineResults(response.data.medicines);
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
                      <td>{tx.medication.name}</td>
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
                      <div className="modal-header">
                        <h3>Pharmacy Transaction for Patient {queueNo}</h3>
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
                                key={medicine.name}
                                className="list-group-item"
                                onClick={() => {
                                  handleMedicineSelect(medicine); // Set the selected medicine
                                  // Clear the search results
                                }}
                              >
                                {medicine.name}
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
                                  <th>Price (₱)</th>
                                  <th>Total Quantity Left</th>
                                  <th>Quantity</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedMedicine.map((medicine, index) => (
                                  <tr key={medicine.name}>
                                    <td>{medicine.name}</td>
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
                                                med.name !== medicine.name
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
                                  alert(
                                    "Sell transaction submitted successfully!"
                                  );
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
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => setShowModal(false)}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ...existing modal content... */}
                    </div>
                  </>
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
