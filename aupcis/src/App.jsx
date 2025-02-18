import { useState } from "react";
import "./App.css";
import AppointmentHistory from "./modules/Patient/AppointmentHistory";
import { Router, Routes, Route } from "react-router-dom";
import Home from "./modules/Home/Home";
import About from "./components/About";
import Services from "./components/Services";
import LogInPage from "./modules/Patient/LogInPage";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



export default function App() {
  return (
    <>
      
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/AppointmentHistory"
            element={<AppointmentHistory />}
          ></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/services" element={<Services />}></Route>
          <Route path="/login-register" element={<LogInPage />}></Route>
        </Routes>
      
    </>
  );
}
