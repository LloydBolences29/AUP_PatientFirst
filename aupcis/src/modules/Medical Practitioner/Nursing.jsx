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
  const [patientfName, setPatientfName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [notification, setNotification] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchPatientData = async () => {
      const res = await fetch("http://localhost:3000/patientname");
      const data = await res.json();
      setPatients(data.patientname);
      setFilteredPatients(data.patientname);
    };
    fetchPatientData();
  }, []);

  useEffect(() => {
    let sortedPatients = [...patients];

    // Sorting based on the selected column
    if (sortConfig.key) {
      sortedPatients.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];

        // Convert values to lowercase for case-insensitive sorting (if string)
        if (typeof valueA === "string") valueA = valueA.toLowerCase();
        if (typeof valueB === "string") valueB = valueB.toLowerCase();

        if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredPatients(sortedPatients);
  }, [sortConfig, patients]);

  // Handle sorting when clicking on a column header
  const handleSort = (key) => {
    setSortConfig((prevSort) => ({
      key,
      direction: prevSort.key === key && prevSort.direction === "asc" ? "desc" : "asc",
    }));
  };


  useEffect(() => {
    setFilteredPatients(
      patients.filter(
        (patient) =>
          patient.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.age.toString().includes(searchTerm) ||
          patient.gender.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, patients]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
  
    // Check if patient already exists in state (before making API call)
    const isDuplicate = patients.some(
      (patient) => patient.firstname.toLowerCase() === patientfName.toLowerCase()
    );
  
    if (isDuplicate) {
      setNotification("Patient already exists");
      setTimeout(() => setNotification(""), 3000);
      return; // Stop execution if duplicate found
    }
  
    const newPatient = {
      patientID,
      firstname: patientfName,
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
  
      const responseData = await response.json();
  
      if (!response.ok) {
        setNotification(responseData.message);
        setTimeout(() => setNotification(""), 3000);
        return;
      }
  
      // Successfully added patient (use functional update to avoid stale state issues)
      setPatients((prevPatients) => [...prevPatients, responseData]);
      setFilteredPatients((prevFiltered) => [...prevFiltered, responseData]);
      setNotification("Patient added successfully");
      setTimeout(() => setNotification(""), 3000);
  
      // Reset fields and close modal
      setIsOpen(false);
      setPatientID("");
      setPatientfName("");
      setPatientAge("");
      setPatientGender("");
    } catch (error) {
      console.error("Error adding patient:", error);
      setNotification("An error occurred. Please try again.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
  
    const updatedPatient = {
      patientID,
      firstname: patientfName,
      age: patientAge,
      gender: patientGender,
    };
  
    try {
      const response = await fetch(
        `http://localhost:3000/patientname/${patientID}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPatient),
        }
      );
  
      const responseData = await response.json();
  
      if (!response.ok) {
        setNotification(responseData.message || "Error updating patient");
        setTimeout(() => setNotification(""), 3000);
        return;
      }
  
      // Ensure state update is done correctly
      setPatients((prevPatients) => 
        prevPatients.map((patient) =>
          patient.patientID === responseData.patientID ? responseData : patient
        )
      );
  
      setFilteredPatients((prevFiltered) =>
        prevFiltered.map((patient) =>
          patient.patientID === responseData.patientID ? responseData : patient
        )
      );
  
      setNotification("Updated successfully");
      setTimeout(() => setNotification(""), 3000);
  
      // Reset form fields and close modal
      setIsOpen(false);
      setPatientID("");
      setPatientfName("");
      setPatientAge("");
      setPatientGender("");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating patient:", error);
      setNotification("An error occurred. Please try again.");
      setTimeout(() => setNotification(""), 3000);
    }
  };
  

  const handleDeletePatient = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/patientname/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedPatients = patients.filter(
          (patient) => patient._id !== id
        );
        setPatients(updatedPatients);
        setFilteredPatients(updatedPatients);
        setNotification("Deleted successfully");
        setTimeout(() => setNotification(""), 3000);
      } else {
        console.error("Error deleting patient:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const handleEditClick = (patient) => {
    setPatientID(patient.patientID);
    setPatientfName(patient.firstname);
    setPatientAge(patient.age);
    setPatientGender(patient.gender);
    setIsEditing(true);
    setIsOpen(true);
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
                  <h2 className="modal-title">
                    {isEditing ? "Update Patient" : "Add Patient"}
                  </h2>
                </>
              }
              body={
                <>
                  <div className="form-container">
                    <div className="form-wrapper">
                      <div className="form-content">
                        <form
                          onSubmit={
                            isEditing ? handleUpdatePatient : handleAddPatient
                          }
                        >
                          <div className="form-group">
                            <label className="form-label">Patient ID:</label>
                            <input
                              id="patientID"
                              type="text"
                              className="form-control"
                              value={patientID}
                              onChange={(e) => setPatientID(e.target.value)}
                              readOnly={isEditing}
                            />

                            <label className="form-label">Patient Name:</label>
                            <input
                              id="patientfName"
                              type="text"
                              className="form-control"
                              value={patientfName}
                              onChange={(e) => setPatientfName(e.target.value)}
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
                              {isEditing ? "Update Patient" : "Add Patient"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => {
                                setIsOpen(false);
                                setIsEditing(false);
                                setPatientID("");
                                setPatientfName("");
                                setPatientAge("");
                                setPatientGender("");
                              }}
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
                        <th onClick={() => handleSort("patientID")}>
                          Patient ID{" "}
                          {sortConfig.key === "patientID"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th onClick={() => handleSort("firstname")}>
                          Name{" "}
                          {sortConfig.key === "firstname"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th onClick={() => handleSort("gender")}>
                          Gender{" "}
                          {sortConfig.key === "gender"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th onClick={() => handleSort("age")}>Age {sortConfig.key === "age" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    {/*table body*/}
                    <tbody>
                      {filteredPatients.map((i) => {
                        return (
                          <tr key={i._id}>
                            <td>{i.patientID}</td>
                            <td>{i.firstname}</td>
                            <td>{i.gender}</td>
                            <td>{i.age}</td>
                            <td>
                              <button
                                className="btn btn-warning"
                                onClick={() => handleEditClick(i)}
                              >
                                Update
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDeletePatient(i._id)}
                              >
                                Delete
                              </button>
                            </td>
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
