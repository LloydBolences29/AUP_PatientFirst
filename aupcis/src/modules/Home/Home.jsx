import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./Home.css";

const Home = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <NavLink className="logo-text navbar-brand text-dark" to="/">
            <span className="patient-Logo">Patient</span>
            <span className="first-Logo">First</span>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/services">
                  Services
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login-register">
                  Login/Register
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

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
              <span className="phoneNumberFooter" id="title">Phone: </span> +63916 123 4567
            </p>
            <p id="contact-info">
              <span className="emailFooter" id="title">Email: </span>
              <a href="mailto: aupclinic@aup.edu.ph" id="contact-info">aupclinic@aup.edu.ph</a>
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
          <p className="footer-bottom-text">© 2021 PatientFirst. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
