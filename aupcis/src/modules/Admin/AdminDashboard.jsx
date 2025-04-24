import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomBarChart from "../../components/CustomBarChart";
import {
  BarChart,
  Bar,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { Col, Container, Row, Card } from "react-bootstrap";

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
  const [perDateData, setPerDateData] = useState([]);
  const [totals, setTotals] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const res = await axios.get(
          `https://aup-patient-first.vercel.app//getDiagnose/mostDiagnosed?groupBy=${selectedType}`
        );
        setDiagnosisData(res.data);
      } catch (err) {
        console.error("Failed to fetch diagnosis data:", err);
      }
    };

    fetchDiagnosis();
  }, [selectedType]);

  console.log("Diagnosis:", diagnosisData);
  // Function to fetch patient count data
  const fetchPatientCounts = async (date, type) => {
    setLoading(true);
    try {
      // Convert date to ISO format (YYYY-MM-DD)
      const formattedDate = date.toISOString().split("T")[0];

      console.log("📅 Sending API request with:", formattedDate, "Type:", type);

      const response = await axios.get(
        `https://aup-patient-first.vercel.app//type-of-visit-report/checkUpPatientperMonth/count?date=${formattedDate}&type=${type}`
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://aup-patient-first.vercel.app//patientTypeCountReport/patientTypeData?groupBy=${selectedType}`
        );
        setPerDateData(res.data.perDate); // Make sure your backend sends this
        setTotals(res.data.totals); // And this too
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    fetchData();
  }, [selectedType]);

  // Convert perDateData to grouped by date with patient types
  const chartData = [];
  const grouped = {};

  perDateData.forEach(({ date, type, count }) => {
    if (!grouped[date]) grouped[date] = { date };
    grouped[date][type] = count;
  });

  for (let date in grouped) {
    chartData.push(grouped[date]);
  }

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
            <div className="container">
              <Card
                md={9}
                className="content-column analytics-card shadow-sm p-3 mb-5 bg-white rounded text-center"
              >
                <div className="page-content">
                  <h1
                    className="page-title fw-bold"
                    style={{ color: "#2c3e50" }}
                  >
                    Admin Dashboard
                  </h1>
                </div>
              </Card>
              {/* Date Picker & Type Selector */}
              <div className="d-flex justify-content-center mb-3">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) =>
                    setSelectedDate(
                      new Date(
                        Date.UTC(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate()
                        )
                      )
                    )
                  }
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                />

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="form-select ml-2"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderColor: "#2c3e50",
                    color: "#2c3e50",
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <Container>
              <Row>
                <Col md={6}>
                  {/* Display Results */}
                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : (
                    <table className="table table-bordered">
                      <thead
                        className="table-dark"
                        style={{ backgroundColor: "#2c3e50" }}
                      >
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
                          <th>Total Patient Visits</th>
                          <th>{totalPatients}</th>
                        </tr>
                      </tfoot>
                    </table>
                  )}
                  {/* Chart */}
                  <CustomBarChart
                    title={`Patient Visits Count (${selectedType})`}
                    data={patientCounts.map((item) => ({
                      label: item._id || "Unknown",
                      value: item.count || 0,
                    }))}
                  />
                </Col>
                <Col md={6}>
                  {/* Total Number of Inpatient and Outpatient */}
                  <table className="table table-bordered">
                    <thead
                      className="table-dark"
                      style={{ backgroundColor: "#2c3e50" }}
                    >
                      <tr>
                        <th>Type</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {totals.map((item) => (
                        <tr key={item.type}>
                          <td>{item.type}</td>
                          <td>{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <th>Total Number of Patients per type</th>
                        <th>
                          {totals.reduce(
                            (sum, item) => sum + (item.total || 0),
                            0
                          )}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                  <LineChart
                    width={450}
                    height={350}
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Inpatient"
                      stroke="#8884d8"
                    />
                    <Line
                      type="monotone"
                      dataKey="Outpatient"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </Col>

                <Col md={12}>
                  <div className="w-full p-4" style={{ minHeight: "500px" }}>
                    <h2
                      className="text-center mb-4"
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#2c3e50",
                        textTransform: "uppercase",
                        borderBottom: "2px solid #2c3e50",
                        paddingBottom: "10px",
                        marginBottom: "20px",
                      }}
                    >
                      Top Diagnosed Illnesses
                    </h2>
                    {diagnosisData && diagnosisData.length > 0 ? (
                      <BarChart
                        width={800}
                        height={400}
                        data={diagnosisData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                          dataKey="diagnosis"
                          type="category"
                          width={150}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#2c3e50" />
                      </BarChart>
                    ) : (
                      <p>No diagnosis data available</p>
                    )}
                  </div>
                </Col>
              </Row>
            </Container>
          </>
        }
      />
    </div>
  );
};

export default AdminDashboard;
