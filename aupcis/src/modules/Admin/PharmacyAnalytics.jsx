import React from "react";
import Sidebar from "../../components/Sidebar";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import CustomLineChart from "../../components/LineChart";

const PharmacyAnalytics = () => {
  const [lineChartData, setLineChartData] = useState([]);
  const [selectedType, setSelectedType] = useState("daily");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
  

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


  const fetchOtherData = async (date, type) => {
    try {
        const response = await axios.get(`https://aup-patientfirst-server.onrender.com/api/pharma/getAnalytics?date=${date}&type=${type}`);
        setData(response.data || []);
        console.log("Fetched other data:", response.data);
    } catch (error) {
        console.error("Error fetching other data:", error);
        setData([]);
    }
}

    useEffect(() => {
        fetchOtherData();
    }, []);


  useEffect(() => {
    fetchPharmacyData(selectedType);
  }, [selectedType]);

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

  return (
    <Sidebar
      links={sidebarLinks}
      pageContent={
        <>
          <Container fluid>

              <Card md={9} className="content-column analytics-card shadow-sm p-3 mb-5 bg-white rounded text-center">
                <div className="page-content">
                  <h1
                    className="page-title fw-bold"
                    style={{ color: "#2c3e50" }}
                  >
                    Pharmacy Analytics
                  </h1>
                  
                </div>
              </Card>

              <div className="text-center my-4">
                <h2 className="text-center">Total Sales</h2>
                {loading ? (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
                        <th>Type</th>
                        <th>Total Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</td>
                        <td>{lineChartData.reduce((acc, item) => acc + item.sales, 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
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
            


            <Row>
              <Col md={12} className="content-column">

                <h2 className="text-center">Sales Trend</h2>
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
            </Row>
          </Container>
        </>
      }
    />
  );
};

export default PharmacyAnalytics;
