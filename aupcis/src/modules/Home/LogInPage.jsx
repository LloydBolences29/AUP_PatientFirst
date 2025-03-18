import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Route/AuthContext"; // Ensure correct import path
import "./LogInPage.css";

const LogInPage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function from AuthContext

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

  // Function to handle login for both Patients & Staff


const handleLogin = async (e, isStaff) => {
  e.preventDefault();

  if (isStaff) {
    if (!staffLoginData.role_ID || !staffLoginData.password) {
      alert("Please enter both Role ID and Password.");
      return;
    }
  } else {
    if (!patientLoginData.patient_ID || !patientLoginData.password) {
      alert("Please enter both Patient ID and Password.");
      return;
    }
  }

  try {
    const loginData = isStaff
      ? { role_ID: staffLoginData.role_ID, password: staffLoginData.password }
      : { patient_ID: patientLoginData.patient_ID, password: patientLoginData.password };

    console.log("🟡 Sending Login Data:", loginData);

    const url = isStaff
      ? "http://localhost:3000/staff/login"
      : "http://localhost:3000/patient/login";

    const response = await axios.post(url, loginData, { withCredentials: true });

    console.log("🟢 Login Response:", response.data);

    console.log("🟢 Full Axios Response:", response);
    console.log("🟢 Extracted Data:", response.data);

    if (!response.data) {
      console.error("🔴 No data received in response");
      alert("Login failed. No response data.");
      return;
    }

    const { allowedPages, token } = response.data;

    if (!allowedPages || allowedPages.length === 0) {
      
      console.error("🔴 No allowed pages assigned!", response.data);
      alert("Login successful, but no allowed pages found.");
      return allowedPages = ["/"]; // Set a default pages
    }

    localStorage.setItem("authToken", token);
    alert("Login Successful! Redirecting...");
    navigate(`/${allowedPages[0]}`);
  } catch (error) {
    console.error("🔴 Login Error:", error.response?.data || error.message);
    alert("Login failed. Check console for details.");
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
          <form className="login-register-form" onSubmit={(e) => handleLogin(e, false)}>
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
          <form className="login-register-form" onSubmit={(e) => handleLogin(e, true)}>
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
