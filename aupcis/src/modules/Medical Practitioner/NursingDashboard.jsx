import React from 'react'
import Sidebar from "../../components/Sidebar";

const NursingDashboard = () => {
    const nurseSidebarLinks = [
        {
          label: "Dashboard",
          path: "/nurse-dashboard",
        },
        {
            label: "Patient Management",
            path: "/patient-management"
          },
      ];
  return (
    <div>
        <Sidebar
                links={nurseSidebarLinks}
                pageContent={
                  <>
                    <h1>This is the dashboard for the Nurses</h1>{" "}
                  </>
                }
              />
        
      
    </div>
  )
}

export default NursingDashboard

