import React from "react";
import "./Home.css";
import { Navbar } from "../Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
//import state from react
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
const navlinks = [
  {
    label: "About",
    path: "/",
  },
  {
    label: "Services",

    path: "/services",
  },
  {
    label: "Log In",
    path: "/login-register",
  },
];

const Home = () => {
  return (
    <>
      <Navbar myProps={navlinks} />

      <div className="body">
        <div className="content">
          <div className="header-content">
            <h1>Welcome to PatientFirst!</h1>
          </div>
          <div className="sub-content">
            <p className="text-content">
              PatientFirst is a platform that allows patients to book
              appointments with doctors and view their medical history.
            </p>
          </div>

          <div className="login-button">
            <div className="span-text-align">
              <div className="span-h-button">
                <NavLink to="/login" className="btn btn-outline-primary mx-3">
                  <span >Log In</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid services">
        <h2 className="services-header">Our Services</h2>
        <div className="service-content">
          <div className="firstCardSection">
            <div className="bookAppointment">
              <h3>Book Appointments</h3>
              <p>
                Patients can book appointments with doctors at their
                convenience.
              </p>
            </div>
            <div className="medicalHistory">
              <h3>View Medical History</h3>
              <p>
                Patients can view their medical history and past appointments.
              </p>
            </div>
          </div>
          <div className="secondCardSection">
            <div className="getReminders">
              <h3>Get Reminders</h3>
              <p>Patients can get reminders for their upcoming appointments.</p>
            </div>

            <div className="anotherService">
              <h3>Get Reminders</h3>
              <p>Patients can get reminders for their upcoming appointments.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer py-4">
        <div className="container">
          <div className="row text-center text-md-start">
            <div className="col-md-3 col-12 mb-3">
              <p className="h5">
                <span className="text-primary">Patient</span>
                <span className="text-secondary">First</span>
              </p>
            </div>

            <div className="col-md-3 col-12 mb-3">
              <h5>Hours</h5>
              <ul className="list-unstyled">
                <li>Monday: 9:00am - 5:00pm</li>
                <li>Tuesday: 9:00am - 5:00pm</li>
                <li>Wednesday: 9:00am - 5:00pm</li>
                <li>Thursday: 9:00am - 5:00pm</li>
                <li>Friday: 8:00am - 4:00pm</li>
                <li>Sunday: 9:00am - 5:00pm</li>
              </ul>
            </div>

            <div className="col-md-3 col-12 mb-3">
              <h5>Contacts</h5>
              <p className="mb-1">AUP Clinic, Putingkahoy, Silang Cavite 4118, Philippines</p>
              <p className="mb-1">
                <strong>Phone:</strong> +63916 123 4567
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:aupclinic@aup.edu.ph" className="text-decoration-none">
                  aupclinic@aup.edu.ph
                </a>
              </p>
            </div>

            <div className="col-md-3 col-12 mb-3">
              <h5>Thoughts To Live By</h5>
              <p className="fst-italic">
                “A merry heart doeth good like a medicine: but a broken spirit drieth the bones.”
              </p>
              <p className="fw-bold">Proverbs 17:22</p>
            </div>
          </div>
        </div>

        <div className="text-white text-center py-2" style={{ backgroundColor: "inherit" }}>
          <p className="mb-0">© 2021 PatientFirst. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
