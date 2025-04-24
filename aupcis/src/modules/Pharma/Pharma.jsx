import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Container, Card, Col, Row } from "react-bootstrap";
import CustomBarChart from "../../components/CustomBarChart";
import PieChart from "../../components/PieChart";
import CustomLineChart from "../../components/LineChart";

const Pharma = () => {
  const [selectedType, setSelectedType] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [pharmaAnalytics, setPharmaAnalytics] = useState(null);
  const [peakTimes, setPeakTimes] = useState([]);
  const [medicineData, setMedicineData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  const fetchPharmacyData = async (type) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://aup-patientfirst-server.onrender.com/api/pharma/sales-over-time?type=${type}`
      );
      setLineChartData(response.data || []);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setLineChartData([]);
    }
    setLoading(false);
  };

  const fetchPeakTimes = async () => {
    try {
      const response = await axios.get(
        "https://aup-patientfirst-server.onrender.com/api/pharma/getPeakTimes"
      );
      setPeakTimes(response.data);
    } catch (error) {
      console.error("❌ Error fetching peak times:", error);
      setPeakTimes([]);
    }
  };

  const fetchTopMedicines = async () => {
    try {
      const response = await axios.get(
        "https://aup-patientfirst-server.onrender.com/api/pharma/most-bought-medicines"
      );
      setMedicineData(response.data);
    } catch (error) {
      console.error("❌ Error fetching top medicines:", error);
      setMedicineData([]);
    }
  };
  console.log("The medicines: ", medicineData)

  useEffect(() => {
    fetchTopMedicines();
    fetchPeakTimes();
  }, []);

  useEffect(() => {
    fetchPharmacyData(selectedType);
  }, [selectedType]);

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
                <Card.Body>
                  <h5 className="card-title">
                    Welcome to the Pharmacy Dashboard!
                  </h5>
                  <p className="card-text">
                    Manage your pharmacy operations efficiently.
                  </p>
                </Card.Body>
              </Card>

              <Row className="mb-4">
                <Col md={12}>
                  <Card className="text-center mb-4">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title">Sales Trend</h5>
                        <p className="card-text">
                          Visualize the sales trend over time.
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

                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : (
                    <CustomLineChart
                      title={`Sales Trend (${selectedType})`}
                      data={lineChartData}
                      xKey="date"
                      yKey="sales"
                    />
                  )}
                </Col>

                <Col md={6}>
                  <div className="text-center mb-3">
                    <strong>Peak Times (Hourly Breakdown)</strong>
                  </div>
                  <CustomBarChart
                    title="Peak Times by Hour"
                    data={peakTimes.map((item) => ({
                      label: `${item._id.toString().padStart(2, "0")}:00`,
                      value: item.totalSales || item.count || 0,
                    }))}
                    xKey="label"
                    yKey="value"
                  />
                </Col>

                <Col md={6}>
                  <div>
                    <h5>Top Medicines Sold</h5>
                    <PieChart data={medicineData} />
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

export default Pharma;
