import Navbar from "../Navbar/Navbar";
import "./AppointmentHistory.css";
import React from "react";
import Card from "../../components/Card";
import Sidebar from "../../components/Sidebar";

const menuLinks = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Doctor",
    path: "/doctorpage",
  },
  {
    label: "My Profile ",
    path: "/profile",
  },
  {
    label: "Appointments",
    path: "/AppointmentHistory",
  },
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

const AppointmentHistory = () => {
  return (
    <>
      <Sidebar
        props={menuLinks}
        activeLink="Appointment Dashboard"
        pageContent={
          <>
            <div className="body">
              <div className="container appointment-info">
                <Card
                  cardTitle="Doctor's Schedule"
                  cardBody={
                    <>
                      <div className="doctor-schedule container">
                        <table className="table">
                          <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>Dr. John Doe</td>
                            <td>01/01/2021</td>
                            <td>10:00</td>
                            <td>Completed</td>
                          </tr>
                        </table>
                      </div>
                    </>
                  }
                />

                <Card
                  cardTitle="Appointment History"
                  cardBody={
                    <>
                      <div className="appointment-history container">
                        <table className="table">
                          <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>Dr. Lloyd Bolences</td>
                            <td>02/01/2025</td>
                            <td>09:00</td>
                            <td>Pending</td>
                          </tr>
                        </table>
                      </div>
                    </>
                  }
                />
              </div>

              <div className="appointment-scheduling">
                <Card
                  cardTitle="Schedule an Appointment"
                  addbtn={
                    <button className="btn btn-primary w-100">
                      Schedule an Appointment
                    </button>
                  }
                  cardBody={
                    <>
                      <div className="table-of-schedules container">
                        <table className="table">
                          <tr>
                            <th className="ID">No.</th>
                            <th className="name">Name</th>
                            <th className="doctor">Doctor</th>
                            <th className="date">Date</th>
                            <th className="time">Time</th>
                            <th className="status">Status</th>
                            <th className="action">Action</th>
                          </tr>
                          <tr>
                            <td className="ID">1</td>
                            <td className="name">John Doe</td>
                            <td className="doctor">Dr. Lloyd Bolences</td>
                            <td className="date">02/01/2025</td>
                            <td className="time">09:00</td>
                            <td className="status">Pending</td>
                            <td>
                              <div className="action">
                                <button className="btn btn-primary m-2">
                                  Confirm
                                </button>
                                <button className="btn btn-danger">
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td className="ID">1</td>
                            <td className="name">John Doe</td>
                            <td className="doctor">Dr. Lloyd Bolences</td>
                            <td className="date">02/01/2025</td>
                            <td className="time">09:00</td>
                            <td className="status">Confirmed</td>
                            <td>
                              <div className="action">
                                <button className="btn btn-outline-primary m-2">
                                  <span className="btn-text">Edit</span>
                                </button>
                                <button className="btn btn-danger">
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td className="ID">1</td>
                            <td className="name">John Doe</td>
                            <td className="doctor">Dr. Lloyd Bolences</td>
                            <td className="date">02/01/2025</td>
                            <td className="time">09:00</td>
                            <td className="status">Cancelled</td>
                            <td>
                              <div className="action">
                                <div className="status-cancelled-wrapper">
                                  <span> Cancelled </span>
                                </div>
                                <div className="status-cancelled-wrapper">
                                  <span> Cancelled </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </>
                  }
                />
              </div>
            </div>
          </>
        }
      />
    </>
  );
};

export default AppointmentHistory;
