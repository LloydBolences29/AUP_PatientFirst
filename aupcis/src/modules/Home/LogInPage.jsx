import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Route/AuthContext"; // Ensure correct import path
import "./LoginPage.css";

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
    setStateFunction((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Function to handle login for both Patients & Staff

  const [allowedPages, setAllowedPages] = useState([]);

  const handleLogin = async (e, isStaff) => {
    e.preventDefault();
  
    // Validate input fields before proceeding
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
        : {
            patient_ID: patientLoginData.patient_ID,
            password: patientLoginData.password,
          };
  
      console.log("🟡 Sending Login Data:", loginData);
  
      const userData = await login(loginData, isStaff); // ✅ Use login() from AuthContext
  
      console.log("🟢 User Data from AuthContext:", userData);
  
      if (!userData || !userData.allowedPages || userData.allowedPages.length === 0) {
        console.error("🔴 No allowed pages received!");
        alert("Login successful, but no access pages found.");
        return;
      }
  
      // ✅ Set default page to the first allowed page
      const targetPath = userData.allowedPages[0];
  
      console.log("🚀 Redirecting to:", targetPath);
      navigate(targetPath, { replace: true }); // ✅ Redirect immediately
  
    } catch (error) {
      console.error("🔴 Login for Error:", error.response?.data || error.message);
      alert("Login failed. Check console for details.");
    }
  };

useEffect(() => {
  if (allowedPages && allowedPages.length > 0) {
    console.log("✅ Allowed Pages:", allowedPages); // Debugging the allowedPages array

    const targetPath = allowedPages[0].startsWith("/")
      ? allowedPages[0] // Use as-is if it starts with "/"
      : `/${allowedPages[0]}`; // Ensure it starts with "/"

    console.log("🚀 Redirecting to:", targetPath); // Debugging the target path
    navigate(targetPath, { replace: true }); // Navigate to the sanitized target path
  }
}, [allowedPages, navigate]); // Ensure 'navigate' is included in dependencies





  // Toggle Login Panels
  const handleRegisterClick = () => setIsRightPanelActive(true);
  const handleLoginClick = () => setIsRightPanelActive(false);

  return (
    <div className="body-form">
      <div
        className={`login-register-container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        id="container"
      >
        {/* Patient Login Form */}
        <div className="login-register-form-container login-container">
          <form
            className="login-register-form"
            onSubmit={(e) => handleLogin(e, false)}
          >
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
            <button className="login-register-btn" type="submit">
              Login
            </button>
          </form>
        </div>

        {/* Staff Login Form */}
        <div className="login-register-form-container register-container">
          <form
            className="login-register-form"
            onSubmit={(e) => handleLogin(e, true)}
          >
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
            <button className="login-register-btn" type="submit">
              Login
            </button>
          </form>
        </div>

        {/* Overlay Section */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="title">Hello Friends</h1>
              <p className="login-register-p">Patients login here.</p>
              <button
                className="ghost login-register-btn"
                onClick={handleLoginClick}
              >
                Patient Login
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="head-one head-title">Staff Login</h1>
              <p className="login-register-p">
                Only authorized staff can log in here.
              </p>
              <button
                className="ghost login-register-btn"
                onClick={handleRegisterClick}
              >
                Staff Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
