import "./App.css";
import AppointmentHistory from "./modules/Patient/AppointmentHistory";
import {Routes, Route } from "react-router-dom";
import Home from "./modules/Home/Home";
import About from "./components/About";
import Services from "./components/Services";
import LogInPage from "./modules/Patient/LogInPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Sidebar from "./components/Sidebar";
import Dashboard from "./modules/Patient/Dashboard";
import PatientProfile from "./modules/Patient/PatientProfile";
import { useEffect } from "react";
import Doctor from "./modules/Patient/Doctor"
import Nursing from "./modules/Medical Practitioner/Nursing"
import Pharma from "./modules/Pharma/Pharma"




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
          <Route path="/" element={<Home />}></Route>
          <Route path = "/dashboard" element = {<Dashboard />}></Route>
          <Route path = "/about" element = {<About />}></Route>
          <Route path = "/profile" element = {<PatientProfile />}></Route>
          <Route path="/doctorpage" element = {<Doctor />}></Route>
          <Route path="/nurse" element = {<Nursing />}></Route>
          <Route path="/pharmacy" element={<Pharma />}></Route>

          <Route
            path="/AppointmentHistory"
            element={<AppointmentHistory />}
          ></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/services" element={<Services />}></Route>
          <Route path="/login-register" element={<LogInPage />}></Route>
          <Route path="/sidebar" element={<Sidebar />}></Route>
        </Routes>
      
    </>
  );
}
