import React, {  useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomBarChart from "../../components/CustomBarChart";

const AdminDashboard = () => {
  const sidebarLinks = [
    {
      label: "Admin Dashboard",
      path: "/admin-dashboard",
    },

    {
      label: "Admin Management ",
      path: "/admin-management",
    },
    {
      label: "Pharmacy Analytics ",
      path: "/pharmacyAnalytics",
    },
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState("daily"); // Default to daily
  const [patientCounts, setPatientCounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch patient count data
  const fetchPatientCounts = async (date, type) => {
    setLoading(true);
    try {
      // Convert date to ISO format (YYYY-MM-DD)
      const formattedDate = date.toISOString().split("T")[0];

      console.log("📅 Sending API request with:", formattedDate, "Type:", type);

      const response = await axios.get(
        `https://localhost:3000/type-of-visit-report/checkUpPatientperMonth/count?date=${formattedDate}&type=${type}`
      );

      if (Array.isArray(response.data)) {
        setPatientCounts(response.data);
      } else {
        console.error("❌ Unexpected API response:", response.data);
        setPatientCounts([]);
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setPatientCounts([]);
    }
    setLoading(false);
  };

  // Auto-fetch data when the date or type changes
  useEffect(() => {
    if (selectedDate && selectedType) {
      fetchPatientCounts(selectedDate, selectedType);
    }
  }, [selectedDate, selectedType]);

  const totalPatients = patientCounts.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );
  return (
    <div>
      <Sidebar
        links={sidebarLinks}
        pageContent={
          <>
            <div className="container mt-4">
              <h2 className="text-center">Patient Count Report</h2>

              {/* Date Picker & Type Selector */}
              <div className="d-flex justify-content-center mb-3">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())))}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                />

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="form-select ml-2"
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
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
                          <td>{item._id || "Unknown"}</td>
                          <td>{item.count || 0}</td>
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
                  {/* Display Total Patients */}
                  <tfoot className="table-light">
                    <tr>
                      <th>Total Patients</th>
                      <th>{totalPatients}</th>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>

            {/* Chart */}
            <CustomBarChart
              title={`Patient Count (${selectedType})`}
              data={patientCounts.map((item) => ({
                label: item._id || "Unknown",
                value: item.count || 0,
              }))}
            />
          </>
        }
      />
    </div>
  );
};

export default AdminDashboard;
