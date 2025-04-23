import React from "react";
import Sidebar from "../../components/Sidebar";
import { Card } from "react-bootstrap"
 
const LabDashboard = () => {
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
          </>
        }
      />
    </div>
  );
};

export default LabDashboard;
