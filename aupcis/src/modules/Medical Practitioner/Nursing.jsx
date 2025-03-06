import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./Nursing.css";
import Modal from "../../components/Modal";

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

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [patientID, setPatientID] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchPatientData = async () => {
      const res = await fetch("http://localhost:3000/patientname");
      const data = await res.json();
      setPatients(data.patientname);
      setFilteredPatients(data.patientname);
      if (data.patientname.length > 0) {
        const lastPatientID = data.patientname[data.patientname.length - 1].patientID;
        setPatientID(parseInt(lastPatientID) + 1);
      } else {
        setPatientID(1);
      }
    };
    fetchPatientData();
  }, []);

  useEffect(() => {
    setFilteredPatients(
      patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.age.toString().includes(searchTerm) ||
          patient.gender.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, patients]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const newPatient = {
      patientID,
      name: patientName,
      age: patientAge,
      gender: patientGender,
    };
    try {
      const response = await fetch("http://localhost:3000/patientname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatient),
      });
      if (response.ok) {
        const addedPatient = await response.json();
        setPatients([...patients, addedPatient]);
        setFilteredPatients([...patients, addedPatient]);
        setNotification("Added successfully");
        setTimeout(() => setNotification(""), 3000);
        setIsOpen(false);
        setPatientID(patientID + 1);
        setPatientName("");
        setPatientAge("");
        setPatientGender("");
      } else {
        console.error("Error adding patient:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

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
                    <div>
                      <button
                        className="btn btn-primary"
                        onClick={() => setIsOpen(true)}
                      >
                        Add Patient
                      </button>
                    </div>

                    <div className="search-input">
                      <input
                        id="patientSearchField"
                        type="search"
                        placeholder="Search"
                        className="form-control search-field"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {notification && (
              <div className="alert alert-success" role="alert">
                {notification}
              </div>
            )}

            <Modal
              show={isOpen}
              title={
                <>
                  <h2 className="modal-title">Add Patient</h2>
                </>
              }
              body={
                <>
                  <div className="form-container">
                    <div className="form-wrapper">
                      <div className="form-content">
                        <form onSubmit={handleAddPatient}>
                          <div className="form-group">
                            <label className="form-label">Patient ID:</label>
                            <input
                              id="patientID"
                              type="text"
                              className="form-control"
                              value={patientID}
                              readOnly
                            />

                            <label className="form-label">Patient Name:</label>
                            <input
                              id="patientName"
                              type="text"
                              className="form-control"
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                            />

                            <label className="form-label">Patient Age:</label>
                            <input
                              id="patientAge"
                              type="number"
                              className="form-control"
                              value={patientAge}
                              onChange={(e) => setPatientAge(e.target.value)}
                            />

                            <label className="form-label">
                              Patient Gender:
                            </label>
                            <input
                              id="patientGender"
                              type="text"
                              className="form-control"
                              value={patientGender}
                              onChange={(e) => setPatientGender(e.target.value)}
                            />
                          </div>
                          <br />
                          <div className="btn-container">
                            <button
                              type="submit"
                              className="add-btn btn btn-primary"
                            >
                              Add Patient
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setIsOpen(false)}
                            >
                              Close
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </>
              }
            ></Modal>
            <br />

            <div className="nurse-div-container container">
              <div className="nurse-div-wrapper">
                <div className="nurse-div-content">
                  {/*table for patient data*/}
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Age</th>
                      </tr>
                    </thead>

                    {/*table body*/}
                    <tbody>
                      {filteredPatients.map((i) => {
                        return (
                          <tr key={i.patientID}>
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
