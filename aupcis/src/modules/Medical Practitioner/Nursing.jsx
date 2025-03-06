import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./Nursing.css";
import axios from "axios";
import bootstrapBundleMin from "bootstrap/dist/js/bootstrap.bundle.min";
import DataTable from "react-data-table-component";

const Nursing = () => {
  const nurseSidebarLinks = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Forms",
      path: "/doctorpage",
      subMenu: [
        {
          label: "Form 1",
          path: "/",
        },
        {
          label: "Form 2",
          path: "/",
        },
      ],
    },
  ];

 

  const [a, setPatient] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      const res = await fetch("http://localhost:3000/patientname");
      const data = await res.json();
      setPatient(data.patientname);
    };
    fetchPatientData();
    // axios
    //   .get("http://localhost:3000/patient")
    //   .then(patient => setPatient(patient.data))
    //   .catch((err) => console.log(err));
  });
  return (
    <div>
      <Sidebar
        props={nurseSidebarLinks}
        activeLink="Nurse Page"
        pageContent={
          <>
            <div className="content-header-container container">
              <div className="content-header-wrapper">
                <div className="content-header">
                  <h1 className="content-header-title">Nurse Page</h1>
                </div>

                <div className="content-search-container">
                  <div className="content-search-wrapper">
                    <div className="search-input">
                      <input
                        id="patientSearchField"
                        type="search"
                        placeholder="Search"
                        className="form-control search-field"
                      />
                    </div>

                    <div className="search-btn">
                      <button className="btn btn-primary">Search</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />

            <div className="nurse-div-container container">
              <div className="nurse-div-wrapper">
                <div className="nurse-div-content">
                  {/*table for patient data*/}
                  <table className="table">
                    <thead>
                      <tr>
                        {/* <th>Patient ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Sex</th>
                        <th>D.O.B.</th>
                        <th>Nationality</th>
                        <th>Religion</th>
                        <th>Address</th> */}
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Age</th>
                      </tr>
                    </thead>

                    {/*table body*/}
                    <tbody>
                      {a.map((i) => {
                        return (
                          <tr>
                            <td>{i.patientID}</td>
                            <td>{i.name}</td>
                            <td>{i.gender}</td>
                            <td>{i.age}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        }
      ></Sidebar>
    </div>
  );
};

export default Nursing;
