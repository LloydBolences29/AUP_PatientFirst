import React from 'react'
import Sidebar from '../../components/Sidebar';
import { Container, Card } from "react-bootstrap"
const CashierDashboard = () => {
    const cashierSidebarLinks = [
        {
          label: "Cashier Dashboard",
          path: "/cashier-dashboard",
        },

        {
          label: "Billing",
          path: "/cashier-billing",
        },
      ];
  return (
    <div>
        <Sidebar
                links={cashierSidebarLinks}
                activeLink="Dashboard"
                pageContent={
                    <>
                    <Container>
                              <Card md={9} className="content-column analytics-card shadow-sm p-3 mb-5 bg-white rounded text-center">
                          <div className="page-content">
                            <h1
                              className="page-title fw-bold"
                              style={{ color: "#2c3e50" }}
                            >
                             Cashier Dashboard
                            </h1>
                            
                          </div>
                        </Card>
                        </Container>
                    </>
                }
                
                ></Sidebar>

      
    </div>
  )
}

export default CashierDashboard
