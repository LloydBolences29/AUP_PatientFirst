import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Form,
  Card,
  Button,
  Container,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import CustomLineChart from "../../components/LineChart";
import axios from "axios";
const LabDashboard = () => {
  const labSidebarLinks = [
    { label: "Dashboard", path: "/lab-dashboard" },
    { label: "Billing", path: "/lab-billing" },
    { label: "Upload", path: "/lab-upload" },
  ];
  const [selectedType, setSelectedType] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [labTotalSales, setLabTotalSales] = useState([]);
  const [salesSummary, setSalesSummary] = useState({
    today: 0,
    month: 0,
    year: 0,
  });
  const [visitChartData, setVisitChartData] = useState([]);
  const [visitTotal, setVisitTotal] = useState(0);

  const fetchVisitData = async (type) => {
    try {
      const res = await axios.get(
        `https://aup-patientfirst-server.onrender.com/labTest/visit-count?type=${type}`
      );
      setVisitChartData(res.data.chartData || []);
      setVisitTotal(res.data.totalForSelectedPeriod || 0);
    } catch (error) {
      console.error("Error fetching visits:", error);
    }
  };

  const fetchSalesSummary = async () => {
    try {
      const response = await axios.get(
        `https://aup-patientfirst-server.onrender.com/labTest/sales-summary`
      );
      setSalesSummary(response.data || { today: 0, month: 0, year: 0 });
    } catch (error) {
      console.error("Error fetching sales summary:", error);
    }
  };

  const fetchTotalSales = async (type) => {
    setLoading(true); // ADD THIS

    try {
      const response = await axios.get(
        `https://aup-patientfirst-server.onrender.com/labTest/sales-over-time?type=${type}`
      );
      setLabTotalSales(response.data || []);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setLabTotalSales([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTotalSales(selectedType);
    fetchSalesSummary();
    fetchVisitData(selectedType);
  }, [selectedType]);

  const totalSalesSum = labTotalSales.reduce(
    (acc, curr) => acc + (curr.sales || 0),
    0
  );
  return (
    <div>
      <Sidebar
        links={labSidebarLinks}
        pageContent={
          <>
            {" "}
            <Card
              md={9}
              className="content-column analytics-card shadow-sm p-3 mb-5 bg-white rounded text-center"
            >
              <div className="page-content">
                <h1 className="page-title fw-bold" style={{ color: "#2c3e50" }}>
                  Laboratory Dashboard
                </h1>
              </div>
            </Card>
            <br />
            <Row className="mb-4 container">
              <Col md={12}>
                <Card className="shadow-sm p-3 bg-white rounded text-center">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title">Total Xray Sales for today</h5>
                      <p className="card-text">
                        ₱
                        {selectedType === "daily"
                          ? salesSummary.today.toLocaleString()
                          : selectedType === "monthly"
                          ? salesSummary.month.toLocaleString()
                          : salesSummary.year.toLocaleString()}
                      </p>
                    </div>

                    <div className="d-flex justify-content-end align-items-center my-4">
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="form-select w-auto"
                      >
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="mt-2 p-4">
                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : (
                    <CustomLineChart
                      title={`Xray Sales Trend (${selectedType})`}
                      data={labTotalSales}
                      xKey="date"
                      yKey="sales"
                    />
                  )}
                </Card>
              </Col>

              <Col md={12} className="mt-4">
                <Card>
                  <Card.Body className="text-center">
                    <Card.Title as="h5">Total Laboratory Visits</Card.Title>
                    <p>
                      {visitTotal.toLocaleString()} {selectedType} visits
                    </p>
                    <CustomLineChart
                      title={`Xray Visits Trend (${selectedType})`}
                      data={visitChartData}
                      xKey="date"
                      yKey="count"
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        }
      />
    </div>
  );
};

export default LabDashboard;
