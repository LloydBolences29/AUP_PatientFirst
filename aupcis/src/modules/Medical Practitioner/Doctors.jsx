import React from 'react'
import Sidebar from '../../components/Sidebar'

const Doctors = () => {
    const doctorSidebarLinks = [
        {
          label: "Dashboard",
          path: "/nurse-dashboard",
        },
        {
            label: "Patient",
            path: "/doctor-patient-management"
          },
      ];
  return (
    <div>

        <Sidebar links ={doctorSidebarLinks}
        pageContent = {
            <>
            <h1>This is the dashboard of the Doctor</h1>
            </>
        }
        />
      
    </div>
  )
}

export default Doctors
