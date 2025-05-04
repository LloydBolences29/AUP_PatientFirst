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
const Xray = () => {
  const xraySidebarLinks = [
    { label: "Dashboard", path: "/xray-dashboard" },
    { label: "Billing", path: "/xray-billing" },
    { label: "Upload", path: "/xray-upload" },
  ];

  const [selectedType, setSelectedType] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [xrayTotalSales, setXrayTotalSales] = useState([]);

  const [salesSummary, setSalesSummary] = useState({
    today: 0,
    month: 0,
    year: 0,
  });
  const fetchSalesSummary = async () => {
    try {
      const response = await axios.get(
        `https://localhost:3000/xray/sales-summary`
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
        `https://localhost:3000/xray/sales-over-time?type=${type}`
      );
      setXrayTotalSales(response.data || []);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setXrayTotalSales([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTotalSales(selectedType);
    fetchSalesSummary();
  }, [selectedType]);

  const totalSalesSum = xrayTotalSales.reduce(
    (acc, curr) => acc + (curr.sales || 0),
    0
  );

  return (
    <div>
      <Sidebar
        links={xraySidebarLinks}
        pageContent={
          <>
            {" "}
            <Card
              md={9}
              className="content-column analytics-card shadow-sm p-3 bg-white rounded text-center"
            >
              <div className="page-content">
                <h1 className="page-title fw-bold" style={{ color: "#2c3e50" }}>
                  Xray Dashboard{" "}
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
                      data={xrayTotalSales}
                      xKey="date"
                      yKey="sales"
                    />
                  )}
                </Card>
              </Col>
            </Row>
          </>
        }
      />
    </div>
  );
};

export default Xray;
