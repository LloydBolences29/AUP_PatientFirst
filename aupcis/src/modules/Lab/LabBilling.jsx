import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  CardHeader,
  Table,
  Modal,
  Card,
  CardFooter,
} from "react-bootstrap";
import axios from "axios";
import io from "socket.io-client";
import "../Pharma/PharmacyTransactions.css";

const socket = io("wss://localhost:3000", {
  secure: true,
  transports: ["websocket"],
  withCredentials: true,
});

const LabBilling = () => {
  const [tests, setTests] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [selectedTest, setSelectedTest] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [waitingQueueData, setWaitingQueueData] = useState([]);
  const [toCashierData, setToCashierData] = useState([]);
  const [forDispense, setForDispense] = useState([]);
  const [queueNo, setQueueNo] = useState("");
  const [queueDispenseNo, setQueueDispenseNo] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    const department = "lab";
    socket.emit("joinDepartmentRoom", department);

    socket.on("queueGenerated", (data) => {
      if (data.department === department) {
        console.log("New Queue Generated for lab:", data.queueNumber);
      }
    });

    return () => {
      socket.off("queueGenerated");
    };
  }, []);

  useEffect(() => {
    socket.on("queueStatusUpdate", (data) => {
      console.log("Queue status updated via socket:", data);
      fetchQueue();
    });

    return () => {
      socket.off("queueStatusUpdate");
    };
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await axios.get(
        `https://aup-patientfirst-server.onrender.com/queue/waiting`,
        { params: { department: "lab" } }
      );
      const waitList = response.data;
      setWaitingQueueData(waitList);
      setQueueNo(waitList[0]?.queueNumber);

      const cashierRes = await axios.get(
        `https://aup-patientfirst-server.onrender.com/queue/sentToCashier`,
        { params: { department: "lab" } }
      );
      setToCashierData(cashierRes.data);

      const dispenseRes = await axios.get(
        `https://aup-patientfirst-server.onrender.com/queue/dispensed`,
        { params: { department: "lab" } }
      );
      setForDispense(dispenseRes.data);
      setQueueDispenseNo(dispenseRes.data[0]?.queueNumber);
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim() !== "") {
      try {
        const response = await axios.get(
          `https://aup-patientfirst-server.onrender.com/labTest/getLabTest/${searchTerm}`
        );
        setTests(response.data);
        setError("");
      } catch (error) {
        setTests(null);
        setError("Category not found or an error occurred.");
        console.error("Error fetching procedure:", error);
      }
    }
  };

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(
        `https://aup-patientfirst-server.onrender.com/patientname/${patientId}`
      );
      setPatientData(response.data || null);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setPatientData(null);
    }
  };

  const calculateTotal = () => {
    return selectedTest.reduce((total, proc) => {
      let price = proc.price;
      if (typeof price === "string") {
        price = parseFloat(price.replace(/[₱$]/g, ""));
      }
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  };

  const removeTest = (index) => {
    setSelectedTest((prev) => prev.filter((_, i) => i !== index));
  };

  const addTest = (proc) => {
    setSelectedTest((prev) => [...prev, proc]);
  };

  const handleGenerateBill = async () => {
    try {
      const response = await axios.post(
        `https://aup-patientfirst-server.onrender.com/labTest/sendLabBilling/${patientId}`,
        { items: selectedTest }
      );

      const statusToUpdate = "sent-to-cashier";
      const queueRes = await axios.patch(
        `https://aup-patientfirst-server.onrender.com/queue/complete/${queueNo}`,
        { status: statusToUpdate }
      );

      console.log("Queue status updated:", queueRes.data);
      console.log("Billing sent successfully:", response.data);
      alert("Lab billing created successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error sending billing:", error);
      alert("Failed to create Lab billing: " + error?.response?.data?.message);
    }
  };

  const handleSkipButton = async () => {
    try {
      const queueRes = await axios.patch(
        `https://aup-patientfirst-server.onrender.com/queue/complete/${queueNo}`,
        { status: "skipped" }
      );
      console.log("Queue status updated:", queueRes.data);
    } catch (error) {
      console.error("Error skipping queue:", error);
    }
  };

  const handleDoneButton = async () => {
    try {
      const queueRes = await axios.patch(
        `https://aup-patientfirst-server.onrender.com/queue/complete/${queueDispenseNo}`,
        { status: "done" }
      );
      console.log("Queue status updated:", queueRes.data);
    } catch (error) {
      console.error("Error completing queue:", error);
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
            {/* Your JSX layout here (omitted for brevity) */}
          </>
        }
      />
    </div>
  );
};

export default LabBilling;
