import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import './AdminRoleManagement.css'

const AdminRoleManagement = () => {
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

  const [formData, setFormData] = useState({
    role_id: '',
    password: '',
    fullName: '',
    address: '',
    city: '',
    role: '',
    zip: ''
  });

  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchAdmin = async () => {
      const response = await fetch('http://localhost:3000/user');
      const data = await response.json();
      console.log(data.user);
    };
    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      setNotification('User added successfully!');
    } else {
      setNotification('Failed to add user.');
    }
  };

  return (
    <div>
      <Sidebar
        props={sidebarLinks}
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

                    {notification && <div className="alert alert-info">{notification}</div>}

                    <form className="admin-form-container" onSubmit={handleSubmit}>
                      <div className="form-row admin-form">
                        <div className="form-group col-md-6">
                          <label htmlFor="role_id">ID</label>
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
                        <label htmlFor="fullName">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          placeholder="Dela Cruz, Juan Miguel, A"
                          value={formData.fullName}
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
                            <option value="Medical Records Officer">Medical Records Officer</option>
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
                        Sign in
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
