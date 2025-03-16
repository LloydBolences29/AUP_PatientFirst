import React from "react";
import Sidebar from "../../components/Sidebar";

const AdminDashboard = () => {
  const sidebarLinks = [
    {
      label: "Admin Dashboard",
      path: "/admin_dashboard",
    },
    // {
    //   label: "Doctor",
    //   path: "/doctorpage",
    // },
    {
      label: "My Profile ",
      path: "/Admin_profile",
    },
    // {
    //   label: "Appointments",
    //   path: "/AppointmentHistory",
    // },
    {
      label: "Medical Records",
      path: "/",
    },
    {
      label: "Billing",
      path: "/",
    },
  ];
  return (
    <div>
      <Sidebar
        props={sidebarLinks}
        pageContent={
          <>
            <h1>This is the dashboard for the admin</h1>{" "}
          </>
        }
      />
    </div>
  );
};

export default AdminDashboard;
