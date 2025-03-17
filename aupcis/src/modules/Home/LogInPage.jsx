import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LogInPage.css";

const LogInPage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const navigate = useNavigate();

  // Patient Login State
  const [patientLoginData, setPatientLoginData] = useState({
    patient_ID: "",
    password: "",
  });

  // Staff Login State
  const [staffLoginData, setStaffLoginData] = useState({
    role_ID: "",
    password: "",
  });

  // Handle Input Changes
  const handleChange = (e, setStateFunction) => {
    setStateFunction((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  // Patient Login Function
  const handlePatientLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/user/login", patientLoginData, {
        withCredentials: true,
      });

      alert("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Invalid patient credentials. Please try again.");
    }
  };

  // Staff Login Function (Dynamic Redirect)
  const handleStaffLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/staff/login", staffLoginData, {
        withCredentials: true,
      });

      const { role, allowedPages } = response.data;

      alert("Login Successful!");
      
      // Store role and allowed pages
      localStorage.setItem("role", role);
      localStorage.setItem("allowedPages", JSON.stringify(allowedPages));

      // Redirect to first allowed page dynamically
      if (allowedPages && allowedPages.length > 0) {
        navigate(`/${allowedPages[0]}`);
      } else {
        navigate("/dashboard"); // Default route if no pages are assigned
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Invalid staff credentials. Please try again.");
    }
  };

  // Toggle Login Panels
  const handleRegisterClick = () => setIsRightPanelActive(true);
  const handleLoginClick = () => setIsRightPanelActive(false);

  return (
    <div className="body-form">
      <div className={`login-register-container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
        
        {/* Patient Login Form */}
        <div className="login-register-form-container login-container">
          <form className="login-register-form" onSubmit={handlePatientLogin}>
            <h1 className="head-one">Patient Login</h1>
            <input
              className="login-register-input"
              type="text"
              name="patient_ID"
              placeholder="Patient ID"
              value={patientLoginData.patient_ID}
              onChange={(e) => handleChange(e, setPatientLoginData)}
              required
            />
            <input
              className="login-register-input"
              type="password"
              name="password"
              placeholder="Password"
              value={patientLoginData.password}
              onChange={(e) => handleChange(e, setPatientLoginData)}
              required
            />
            <button className="login-register-btn" type="submit">Login</button>
          </form>
        </div>

        {/* Staff Login Form */}
        <div className="login-register-form-container register-container">
          <form className="login-register-form" onSubmit={handleStaffLogin}>
            <h1 className="head-one">Staff Login</h1>
            <input
              className="login-register-input"
              type="text"
              name="role_ID"
              placeholder="Role ID"
              value={staffLoginData.role_ID}
              onChange={(e) => handleChange(e, setStaffLoginData)}
              required
            />
            <input
              className="login-register-input"
              type="password"
              name="password"
              placeholder="Password"
              value={staffLoginData.password}
              onChange={(e) => handleChange(e, setStaffLoginData)}
              required
            />
            <button className="login-register-btn" type="submit">Login</button>
          </form>
        </div>

        {/* Overlay Section */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="title">Hello Friends</h1>
              <p className="login-register-p">Patients login here.</p>
              <button className="ghost login-register-btn" onClick={handleLoginClick}>Patient Login</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="head-one head-title">Staff Login</h1>
              <p className="login-register-p">Only authorized staff can log in here.</p>
              <button className="ghost login-register-btn" onClick={handleRegisterClick}>Staff Login</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LogInPage;
