import React from "react";
import Sidebar from "../../components/Sidebar";





const sidebarLinks = [
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
const Dashboard = () => {
  


  return (
    <>
      <div>
        <Sidebar props={sidebarLinks}
        userLink={links}
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
