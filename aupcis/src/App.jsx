import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AppointmentHistory from "./modules/Patient/AppointmentHistory";
import { Router, Routes, Route } from "react-router-dom";
import Home from "./modules/Home/Home";
import About from "./components/About";
import Services from "./components/Services";
import LogInPage from "./modules/Patient/LogInPage";

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
