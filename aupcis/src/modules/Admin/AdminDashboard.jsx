import React from "react";
import Sidebar from "../../components/Sidebar";

const AdminDashboard = () => {
  const sidebarLinks = [
    {
      label: "Admin Dashboard",
      path: "/admin-dashboard",
    },
    // {
    //   label: "Doctor",
    //   path: "/doctorpage",
    // },
    {
      label: "Admin Management ",
      path: "/admin-management",
    }
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
