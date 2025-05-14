import React from "react";
import Sidebar from "../../components/Sidebar";
import "./dashboard.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Card, Container } from "react-bootstrap";

const Dashboard = () => {
  const { patient_id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientCounts, setPatientCounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle My Profile click

  // Sidebar links
    const sidebarLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Symptom Checker", path: "/symptomChecker" },
    { label: "My Profile", path: `/profile/${patient_id}` },
    { label: "Request", path: "/request" },
  ];

  // Fetch patient counts
  const fetchPatientCounts = async () => {
    setLoading(true);
    const formattedDate = selectedDate.toISOString().split("T")[0];

    try {
      const response = await fetch(
        `https://localhost:3000/type-of-visit-report/checkUpPatientperMonth/count?date=${formattedDate}`
      );
      const data = await response.json();
      console.log("API Response:", data);
      setPatientCounts(data);
    } catch (error) {
      console.error("Error fetching patient counts:", error);
    }
    setLoading(false);
  };
  return (
    <>
      <div>
        <Sidebar
          links={sidebarLinks}
          activeLink="Dashboard"
          pageContent={
            <>
              <Container>
                <Card
                  md={9}
                  className="content-column analytics-card shadow-sm p-3 bg-white rounded text-center"
                >
                  <div className="page-content">
                    <h1
                      className="page-title fw-bold"
                      style={{ color: "#2c3e50" }}
                    >
                      Patient Dashboard
                    </h1>
                  </div>
                </Card>
              </Container>

            </>
          }
        />
      </div>
    </>
  );
};

export default Dashboard;
