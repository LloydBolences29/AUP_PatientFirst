import { useState } from "react";
import React from "react";
import Sidebar from "../../components/Sidebar";
import "../Patient/PatientProfile.css";

const PatientProfile = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const menuLinks = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    // {
    //   label: "Doctor",
    //   path: "/doctorpage",
    // },
    {
      label: "My Profile ",
      path: "/profile",
    },
    // {
    //   label: "Appointments",
    //   path: "/AppointmentHistory",
    // },
    {
      label: "Medical Records",
      path: "/",
    },
    {
      label: "Billing",
      path: "/",
    },
  ];

  const links = [
    {
      label: "Log Out",
      path: "/home",
    },
  ];

  return (
    <div>
      <Sidebar
        props={menuLinks}
        activeLink="Profile"
        pageContent={
          <>
            <div className="pageContent-container">
              <div className="pageContent-wrapper">
                {/* Patient Profile Header */}
                <div className="patient-profile-header">
                  <div className="patient-profile-wrapper">
                    <div className="grid-items item-1 patient-profile-img">
                      <img
                        id="patient-profile-img"
                        src="../../../public/img/profile.jpg"
                        alt="profile"
                      />
                    </div>
                    <div id="patient-info-wrapper">
                      <div className="grid-items item-2 patient-basic-info">
                        <div className="patient-name"><h2 id="patient-name">Lloyd Bolences</h2></div>
                        <div className="additional-patient-info">
                          <div className="add-info-flex-items" id="gender">
                            <p>Male</p>
                          </div>

                          <div className="add-info-flex-items" id="religion">
                            <p>Seventh-day Adventist</p>
                          </div>

                          <div className="add-info-flex-items" id="patient-ID">
                            <p>2051068</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid-items item-3 patient-vital-signs">
                        <div>
                          <label>BMI:</label>
                          <p>120/80</p>
                        </div>
                        <div>
                          <label>Weight:</label>
                          <p>120/80</p>
                        </div>
                        <div>
                          <label>Heart Rate:</label>
                          <p>120/80</p>
                        </div>
                        <div>
                          <label>Temperature:</label>
                          <p>120/80</p>
                        </div>
                        <div>
                          <label>Pulse Rate:</label>
                          <p>120/80</p>
                        </div>
                        <div>
                          <label>Pulse Rate:</label>
                          <p>120/80</p>
                        </div>
                        <div>
                          <label>Respiratory Rate:</label>
                          <p>120/80</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="button-wrapper">
                  <div className="btn">
                    <button
                      className={`btn btn-outline-primary ${
                        activeIndex === 0 ? "active" : ""
                      }`}
                      onClick={() => setActiveIndex(0)}
                    >
                      Personal Information
                    </button>
                  </div>
                  <div className="btn">
                    <button
                      className={`btn btn-outline-primary ${
                        activeIndex === 1 ? "active" : ""
                      }`}
                      onClick={() => setActiveIndex(1)}
                    >
                      Result
                    </button>
                  </div>
                  <div className="btn">
                    <button
                      className={`btn btn-outline-primary ${
                        activeIndex === 2 ? "active" : ""
                      }`}
                      onClick={() => setActiveIndex(2)}
                    >
                      Others
                    </button>
                  </div>
                </div>

                <div className="profile-content">
                  <div className="profile-wrapper">
                    <div className="profile-header">
                      <h2>Personal Information</h2>
                    </div>

                    <br />

                    <div className="profile-data-container">
                      <div className="profile-data-wrapper">
                        <div className="grid-item patient-fullname">
                          <label>First Name:</label>
                          <p>John Doe</p>
                          <label>Middle Initial:</label>
                          <p>John Doe</p>
                          <label>Surname:</label>
                          <p>John Doe</p>
                        </div>

                        <div className="grid-item basic-additional-info">
                          <label>Address:</label>
                          <p>
                            Blk 30 L 80 Masipag St. Bria Homes Brgy. Banadero,
                            Calamba City of Laguna
                          </p>

                          <label>Date of Birth:</label>
                          <p>John Doe</p>

                          <label>Age:</label>
                          <p>John Doe</p>
                        </div>

                        <div className="grid-item additional-info">
                          <label>Phone Number:</label>
                          <p>John Doe</p>

                          <label>Email:</label>
                          <p>John Doe</p>

                          <label>Gender:</label>
                          <p>John Doe</p>

                          <label>Blood Type:</label>
                          <p>John Doe</p>
                        </div>
                      </div>
                    </div>

                    <div className="lower-information">
                      <div className="emergency-contact-container">
                        <div className="emergency-contact-wrapper">
                          <div className="emergency-contact-header">
                            <h2>Emergency Contact</h2>
                          </div>

                          <div className="emergency-contact-content">
                            <div className="emergency-contact-data">
                              <div className="emergency-grid-items">
                                <label>Full Name:</label>
                                <p>John Doe</p>
                              </div>
                              <div className="emergency-grid-items">
                                <label>Relationship:</label>
                                <p>John Doe</p>
                              </div>
                              <div className="emergency-grid-items">
                                <label>Phone Number:</label>
                                <p>John Doe</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="health-information-container">
                        <div className="health-information-wrapper">
                          <div className="health-information-header">
                            <h2>Health Information</h2>
                          </div>

                          <div className="health-information-data">
                            <div className="health-grid-items">
                              <label htmlFor="">
                                Medical Record Number (MRN):
                              </label>
                              <p>John Doe</p>
                            </div>

                            <div className="health-grid-items">
                              <label htmlFor="">Allergies:</label>
                              <p>John Doe</p>
                            </div>

                            {/* <div className="health-grid-items">
                              <label htmlFor="">Blood Pressure:</label>
                              <p>John Doe</p>
                            </div>

                            <div className="health-grid-items">
                              <label htmlFor="">Temperature:</label>
                              <p>John Doe</p>
                            </div>

                            <div className="health-grid-items">
                              <label htmlFor="">Heart Rate:</label>
                              <p>John Doe</p>
                            </div>
                            <div className="health-grid-items">
                              <label htmlFor="">R Rate:</label>
                              <p>John Doe</p>
                            </div>
                            <div className="health-grid-items">
                              <label htmlFor="">Pulse Rate:</label>
                              <p>John Doe</p>
                            </div>
                            <div className="health-grid-items">
                              <label htmlFor="">Weight:</label>
                              <p>John Doe</p>
                            </div>
                            <div className="health-grid-items">
                              <label htmlFor="">Height:</label>
                              <p>John Doe</p>
                            </div>
                            <div className="health-grid-items">
                              <label htmlFor="">LMP:</label>
                              <p>John Doe</p>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default PatientProfile;
