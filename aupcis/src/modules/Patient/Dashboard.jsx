import React from "react";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import './dashboard.css'

const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Doctor",
    path: "/doctorpage",
  },
  {
    label: "My Profile ",
    path: "/profile",
  },
  {
    label: "Appointments",
    path: "/AppointmentHistory",
  },
  {
    label: "Medical Records",
    path: "/",
  },
  {
    label: "Billing",
    path: "/",
  },
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
        <Sidebar
          props={sidebarLinks}
          userLink={links}
          activeLink="Dashboard"
          pageContent={
            <>
              <div className="appointment-card-wrapper">
                <div className="appointment-card">
                  <Card
                    cardTitle="Upcoming Appointment"
                    cardBody={
                      <>
                        <h1>this is the dashboard</h1>
                      </>
                    }
                  />
                </div>

                <div className="billing-card">
                  <Card
                    cardTitle="Billing Information"
                    cardBody={
                      <>
                        <h1>this is the dashboard</h1>
                      </>
                    }
                  />
                </div>

                <div className="AI-card">
                  <Card
                    cardTitle=""
                    cardBody={
                      <>
                        <h1>Get help with diagnosis with our AI</h1>
                      </>
                    }
                  />
                </div>
              </div>
            </>
          }
        />
      </div>
    </>
  );
};

export default Dashboard;
