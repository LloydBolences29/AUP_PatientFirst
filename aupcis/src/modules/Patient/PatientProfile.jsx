import React from 'react'
import Sidebar from '../../components/Sidebar';

const PatientProfile = () => {
    const menuLinks = [
        {
          label: "Dashboard",
          path: "/dashboard",
        },
        {
          label: "My Profile ",
          path: "/profile",
        },
        {
          label: "Appointments",
          path: "/AppointmentHistory"
        },
        {
          label: "Medical Records",
          path: "/"
        },
        {
          label: "Billing",
          path: "/"
        }
      ];
      
      const links = [
        {
          label: "Log Out",
          path: "/home",
        },
      ];


  return (


    <div>

        <Sidebar props={menuLinks}
        activeLink= "Profile"
        pageContent={

            <>
            <h1>This is Patient's Profile Page</h1>
            </>
        }
        
        />

        
      
    </div>
  )
}

export default PatientProfile
