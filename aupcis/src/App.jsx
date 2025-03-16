import "./App.css";
import AppointmentHistory from "./modules/Patient/AppointmentHistory";
import { Routes, Route } from "react-router-dom";
import Home from "./modules/Home/Home";
import About from "./components/About";
import Services from "./components/Services";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Sidebar from "./components/Sidebar";
import Dashboard from "./modules/Patient/Dashboard";
import PatientProfile from "./modules/Patient/PatientProfile";
import { useEffect } from "react";
import Doctor from "./modules/Patient/Doctor";
import Nursing from "./modules/Medical Practitioner/Nursing";
import Pharma from "./modules/Pharma/Pharma";
import LogInPage from "./modules/Home/LogInPage";
import AdminDashboard from "./modules/Admin/AdminDashboard";
import AdminRoleManagement from "./modules/Admin/AdminRoleManagement";

export default function App() {
  // useEffect(() =>{

  //   const fetchData = async () => {
  //     const res = await fetch('http://localhost:3000')
  //     const data = await res.json()
  //     console.log(data)
  //   }
  //   fetchData();

  // })

  return (
    <>
      <Routes>
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
        {/* <Route
          path="/"
          element={
            <ProtectedRoute
              allowedRoles={[
                "patient",
                "nurse",
                "doctor",
                "admin",
                "MRO",
                "cashier",
                "pharmacist",
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* For patient */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "patient"
                
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          } */}


        {/* FOR HOMEPAGE */}
        <Route path="/login" element={<LogInPage />}></Route>
        {/* for patient */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/doctorpage" element={<Doctor />} />

        {/* For Admin page */}
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/admin_profile" element={<AdminRoleManagement />} />
        {/* <Route path="/profile" element={
            <ProtectedRoute
              allowedRoles={[
                "patient"
                
              ]}
            >
              <PatientProfile />
            </ProtectedRoute>
          }/>
        <Route path="/doctorpage" element={
            <ProtectedRoute
              allowedRoles={[
                "patient"
                
              ]}
            >
              <Doctor />
            </ProtectedRoute>
          }/> */}

        {/* For Medical Practitioner */}
        {/* for nurses */}
        <Route path="/patient-management" element={<Nursing />}></Route>

        {/* For pharma */}
        <Route path="/pharmacy" element={<Pharma />}></Route>

        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>

        <Route
          path="/AppointmentHistory"
          element={<AppointmentHistory />}
        ></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/services" element={<Services />}></Route>

        <Route path="/sidebar" element={<Sidebar />}></Route>
      </Routes>
    </>
  );
}
