import React from 'react'
import Sidebar from '../../components/Sidebar';
import { Card } from "react-bootstrap"

const Rooms = () => {
    const nurseSidebarLinks = [
      {
        label: "Cashier Dashboard",
        path: "/cashier-dashboard",
      },
  
      {
        label: "Billing",
        path: "/cashier-billing",
      },  
      {
        label: "Admitting",
        path: "/room-management",
      },
      ];
  return (
    <div>
        <Sidebar links={nurseSidebarLinks} pageContent = {
<>
<Card md={9} className="content-column analytics-card shadow-sm p-3 mb-1 bg-white rounded text-center">
                          <div className="page-content">
                            <h1
                              className="page-title fw-bold"
                              style={{ color: "#2c3e50" }}
                            >
                             Room Management
                            </h1>
                            
                          </div>
                        </Card>
</>

        } />
      
    </div>
  )
}

export default Rooms
