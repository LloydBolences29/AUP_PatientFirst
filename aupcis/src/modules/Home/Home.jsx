import React from "react";
import "./Home.css";
import { Navbar } from "../Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Modal from "../../components/Modal";
//import state from react
import { useState, useEffect } from "react";
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
                <button
                  className="text-link btn"
                  to="/login-register"
                >
                  <span className="text-wrapper">Log In</span>
                </button>
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

      <footer className="footer">
        <div className="footer-content container">
          <div className="footer-logo">
            <p className="footer-text">
              <span className="patientLogo">Patient</span>
              <span className="firstLogo">First</span>
            </p>
          </div>

          <div className="footer-hours">
            <h3 className="hoursHeader">Hours</h3>
            <div className="hoursSchedule">
              <div className="hoursDays">
                <p>Monday: </p>
                <p>Tuesday: </p>
                <p>Wednesday: </p>
                <p>Thursday: </p>
                <p>Friday: </p>
                <p>Sunday: </p>
              </div>

              <div className="hoursTime">
                <p>9:00am - 5:00pm</p>
                <p>9:00am - 5:00pm</p>
                <p>9:00am - 5:00pm</p>
                <p>9:00am - 5:00pm</p>
                <p>8:00am - 4:00pm</p>
                <p>9:00am - 5:00pm</p>
              </div>
            </div>
          </div>

          <div className="footer-contacts">
            <h3 className="contactsFooter">Contacts</h3>
            <p className="contactInfo" id="contact-info">
              AUP Clinic, Putingkahoy, Silang Cavite 4118, Philippines
            </p>
            <p id="contact-info">
              <span className="phoneNumberFooter" id="title">
                Phone:{" "}
              </span>{" "}
              +63916 123 4567
            </p>
            <p id="contact-info">
              <span className="emailFooter" id="title">
                Email:{" "}
              </span>
              <a href="mailto: aupclinic@aup.edu.ph" id="contact-info">
                aupclinic@aup.edu.ph
              </a>
            </p>
          </div>

          <div className="footer-thoughts">
            <h3 className="thoughtsFooter">Thoughts To Live By</h3>
            <p id="contact-info">
              “A merry heart doeth good like a medicine: but a broken spirit
              drieth the bones.”
            </p>
            <p id="title">Proverbs 17:22</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-bottom-text">
            © 2021 PatientFirst. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;
