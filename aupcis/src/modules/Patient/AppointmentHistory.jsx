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
    label: "My Profile ",
    path: "/profile",
  },
  {
    label: "Appointments",
    path: "/AppointmentHistory"
  },
  {
    label: "Medical Records",
    path: "/"
  },
  {
    label: "Billing",
    path: "/"
  }
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

    <Sidebar props={menuLinks}
    activeLink="Appointment Dashboard"
    pageContent={

      <>
       <div className="body">
        <div className="container appointment-info">
          <Card
            cardTitle="Doctor's Schedule"
            cardBody={
              <>
                <div className="container">
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
                <div className="container">
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
              <button className="btn btn-primary ms-auto">Schedule an Appointment</button>
            }
            cardBody={
              <>
                <div className="container">
                  <table className="table">
                    <tr>
                      <th>No.</th>
                      <th>Name</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>John Doe</td>
                      <td>Dr. Lloyd Bolences</td>
                      <td>02/01/2025</td>
                      <td>09:00</td>
                      <td>Pending</td>
                      <td>

                      <button className="btn btn-primary m-2">Confirm</button>
                        <button className="btn btn-danger">Cancel</button>
                      </td>
                    </tr>

                    <tr>
                      <td>1</td>
                      <td>John Doe</td>
                      <td>Dr. Lloyd Bolences</td>
                      <td>02/01/2025</td>
                      <td>09:00</td>
                      <td>Confirmed</td>
                      <td>

                      <button className="btn btn-outline-primary m-2"><span className="btn-text">Edit</span></button>
                        <button className="btn btn-danger">Cancel</button>
                      </td>
                    </tr>

                    <tr>
                      <td>1</td>
                      <td>John Doe</td>
                      <td>Dr. Lloyd Bolences</td>
                      <td>02/01/2025</td>
                      <td>09:00</td>
                      <td>Cancelled</td>
                      <td>

                        <span> - </span>
                        <span> - </span>
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
      {/* <Navbar myProps={menuLinks} /> */}

      {/* <div className="body">
        <div className="container appointment-info">
          <Card
            cardTitle="Doctor's Schedule"
            cardBody={
              <>
                <div className="container">
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
                <div className="container">
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
              <button className="btn btn-primary ms-auto">Add</button>
            }
            cardBody={
              <>
                <div className="container">
                  <table className="table">
                    <tr>
                      <th>No.</th>
                      <th>Name</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>John Doe</td>
                      <td>Dr. Lloyd Bolences</td>
                      <td>02/01/2025</td>
                      <td>09:00</td>
                      <td>Pending</td>
                      <td>
                        <button className="btn btn-primary">Cancel</button>
                      </td>
                    </tr>
                  </table>
                </div>
              </>
            }
          />
        </div>
      </div> */}
    </>
  );
};

export default AppointmentHistory;
