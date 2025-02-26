import React from "react";
import Sidebar from "../../components/Sidebar";





const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Doctors",
    path: "/",

  },
  {
    label: "My Profile ",
    path: "/",
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
const Dashboard = () => {
  


  return (
    <>
      <div>
        <Sidebar props={sidebarLinks}
        activeLink="Dashboard"
        pageContent={

          <>
          <div>
            <h1>  this is the content </h1>
          </div>
          </>

        } />
      </div>
    </>
  );
};

export default Dashboard;
