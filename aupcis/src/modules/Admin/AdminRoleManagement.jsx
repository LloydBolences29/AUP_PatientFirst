import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "./AdminRoleManagement.css";

const AdminRoleManagement = () => {
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

  const [formData, setFormData] = useState({
    role_ID: "",
    password: "",
    fullname: "",
    address: "",
    city: "",
    role: "",
    zip: "",
  });

  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      const response = await fetch("http://localhost:3000/api/roles/user");
    
      try {
        const data = await response.json(); // ✅ Read response only once
        console.log("Parsed JSON:", data);
      } catch (error) {
        console.error("Response is not JSON:", error);
      }
    };
    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting FormData:", formData); // Debugging
    const response = await fetch("http://localhost:3000/api/roles/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const text = await response.text(); // Read raw response
    console.log("Raw response:", text);

    try {
      const data = JSON.parse(text); // Try parsing as JSON
      console.log("Parsed JSON:", data);
      if (response.ok) {
        setNotification("User added successfully!");
      } else {
        setNotification("Failed to add user.");
      }
    } catch (error) {
      console.error("Response is not JSON:", error);
      setNotification("Failed to add user.");
    }

    setTimeout(() => {
      setNotification("");
    }, 3000); // Clear notification after 3 seconds
  };

  return (
    <div>
      <Sidebar
        links={sidebarLinks}
        pageContent={
          <>
            {/* Wrapper for the admin page */}
            <div className="admin-page-container">
              <div className="admin-page-wrapper">
                {/* admin navbar */}
                <div className="admin-navbar-container">
                  <div className="admin-navbar">
                    <h1>Role Management</h1>
                  </div>
                </div>

                {/* admin content */}
                <div className="admin-content-container">
                  <div className="admin-content">
                    <h1>Admin Role Management</h1>
                    <p>Manage the roles of the users in the system</p>

                    {notification && (
                      <div className="alert alert-info">{notification}</div>
                    )}

                    <form
                      className="admin-form-container"
                      onSubmit={handleSubmit}
                    >
                      <div className="form-row admin-form">
                        <div className="form-group col-md-6">
                          <label htmlFor="role_ID">ID</label>
                          <input
                            type="text"
                            className="form-control"
                            id="role_ID"
                            placeholder="ID"
                            value={formData.role_ID}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="password">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="fullname">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullname"
                          placeholder="Dela Cruz, Juan Miguel, A"
                          value={formData.fullname}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="address">Address</label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          placeholder="Apartment, studio, or floor"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="city">City</label>
                          <input
                            type="text"
                            className="form-control"
                            id="city"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="role">Role: </label>
                          <select
                            id="role"
                            className="form-control"
                            value={formData.role}
                            onChange={handleChange}
                          >
                            <option value="">Choose...</option>
                            <option value="Nurse">Nurse</option>
                            <option value="Doctor">Doctor</option>
                            <option value="MedicalRecordsOfficer">
                              Medical Records Officer
                            </option>
                            <option value="Pharmacist">Pharmacist</option>
                            <option value="Cashier">Cashier</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                        <div className="form-group col-md-2">
                          <label htmlFor="zip">Zip</label>
                          <input
                            type="text"
                            className="form-control"
                            id="zip"
                            value={formData.zip}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-outline-primary">
                        Add role
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default AdminRoleManagement;
