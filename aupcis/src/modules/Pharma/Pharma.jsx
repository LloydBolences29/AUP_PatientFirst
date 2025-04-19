import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Container, Card, Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomBarChart from "../../components/CustomBarChart";

const Pharma = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [pharmaAnalytics, setPharmaAnalytics] = useState(null);
  const [peakTimes, setPeakTimes] = useState([]);

  const fetchPharmacyData = async (date, type) => {
    setLoading(true);
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await axios.get(
        `https://localhost:3000/api/pharma/getAnalytics?date=${formattedDate}&type=${type}`
      );
      setPharmaAnalytics(response.data);
    } catch (error) {
      console.error("❌ Error fetching pharmacy data:", error);
      setPharmaAnalytics(null);
    }
    setLoading(false);
  };

  const fetchPeakTimes = async () => {
    try {
      const response = await axios.get("https://localhost:3000/api/pharma/getPeakTimes");
      setPeakTimes(response.data);
    } catch (error) {
      console.error("❌ Error fetching peak times:", error);
      setPeakTimes([]);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedType) {
      fetchPharmacyData(selectedDate, selectedType);
    }
  }, [selectedDate, selectedType]);

  useEffect(() => {
    fetchPeakTimes();
  }, []);

  const pharmasidebarLinks = [
    { label: "Pharmacy Dashboard", path: "/pharma-dashboard" },
    { label: "Medicine List", path: "/medicine-list" },
    { label: "Pharmacy Transaction", path: "/pharma-transaction" },
    { label: "Prescriptions", path: "/prescription-page" },
    { label: "Analytics and Reports", path: "/pharma-analytics" },
  ];

  return (
    <div>
      <Sidebar
        links={pharmasidebarLinks}
        activeLink="Dashboard"
        pageContent={
          <>
            <Container className="mt-4">
              <Card className="text-center">
                <Card.Header>Pharmacy Dashboard</Card.Header>
                <Card.Body>
                  <h5 className="card-title">Welcome to the Pharmacy Dashboard!</h5>
                  <p className="card-text">Manage your pharmacy operations efficiently.</p>
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-center align-items-center my-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) =>
                    setSelectedDate(
                      new Date(
                        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
                      )
                    )
                  }
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                />

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="form-select ms-2"
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <Row className="mb-4">
                <Col md={6}>
                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : (
                    <table className="table table-bordered">
                      <thead className="table-dark">
                        <tr>
                          <th className="text-center">Category</th>
                          <th className="text-center">Total Sales</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pharmaAnalytics ? (
                          <tr>
                            <td className="text-center">
                              {pharmaAnalytics.date || "Selected Date"}
                            </td>
                            <td className="text-center">
                              {pharmaAnalytics.totalSales || 0}
                            </td>
                          </tr>
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

                  <CustomBarChart
                    title={`Total Sales (${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)})`}
                    data={
                      pharmaAnalytics
                        ? [
                            {
                              label: pharmaAnalytics.date || "Selected Date",
                              value: pharmaAnalytics.totalSales || 0,
                            },
                          ]
                        : []
                    }
                  />
                </Col>

                <Col md={6}>
                  {pharmaAnalytics && (
                    <div className="text-center mb-3">
                      <strong>
                        Sales for {pharmaAnalytics.date || "Selected Date"}: ₱
                        {pharmaAnalytics.totalSales || 0}
                      </strong>
                      <br />
                      Here's how that breaks down by the hour:
                    </div>
                  )}

                  <CustomBarChart
                    title="Peak Times by Hour"
                    data={peakTimes.map((item) => ({
                      label: `${item._id.toString().padStart(2, "0")}:00`,
                      value: item.totalSales || item.count || 0,
                    }))}
                  />
                </Col>
              </Row>
            </Container>
          </>
        }
      />
    </div>
  );
};

export default Pharma;
