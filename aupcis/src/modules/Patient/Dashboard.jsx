import React from "react";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import "./dashboard.css";
import { useParams } from "react-router-dom";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  // const { _id: patientID } = useParams(); // ✅ Get patient ID from URL

  const sidebarLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Symptom Checker", path: "/symptomChecker" },
    { label: "My Profile", path: `/profile` },
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientCounts, setPatientCounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPatientCounts = async () => {
    setLoading(true);
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    try {
      const response = await fetch(
        `http://localhost:3000/type-of-visit-report/checkUpPatientperMonth/count?date=${formattedDate}`
      );
      const data = await response.json();
      console.log("API Response:", data); // ✅ Debug API response

      setPatientCounts(data);
    } catch (error) {
      console.error("Error fetching patient counts:", error);
    }
    setLoading(false);
  };

  // const handleDateChange = (date) => {
  //   console.log("New Date Selected:", date);
  //   setSelectedDate(date);
  // };
  console.log("Selected Date:", selectedDate);

  // const links = [
  //   {
  //     label: "Log Out",
  //     path: "/home",
  //   },
  // ];

  return (
    <>
      <div>
        <Sidebar
          links={sidebarLinks}
          activeLink="Dashboard"
          pageContent={
            <>
             <div className="container mt-4">
      <h2 className="text-center">Patient Count by Date</h2>

      {/* Date Picker */}
      <div className="d-flex justify-content-center mb-3">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="form-control"
          dateFormat="yyyy-MM-dd"
        />
        <button className="btn btn-primary ms-2" onClick={fetchPatientCounts}>
          Get Count
        </button>
      </div>

      {/* Display Results */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Purpose</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {patientCounts.length > 0 ? (
              patientCounts.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
                  <td>{item.count}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
            </>
          }
        />
      </div>
    </>
  );
};

export default Dashboard;
