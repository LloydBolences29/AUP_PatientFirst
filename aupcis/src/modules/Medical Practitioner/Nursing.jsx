import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./Nursing.css";
import Modal from "../../components/Modal";
import Cookies from "js-cookie";

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
  const [patientMiddleName, setPatientMiddleName] = useState("");
  const [patientlastName, setPatientlastName] = useState("");
  const [patientContact, setPatientContact] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [patientDOB, setPatientDOB] = useState("");
  const [patientCivilStatus, setPatientCivilStatus] = useState("");
  const [patientNationality, setPatientNationality] = useState("");
  const [patientReligion, setPatientReligion] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [notification, setNotification] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedPatient, setSelectedPatient] = useState(null);

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
      direction:
        prevSort.key === key && prevSort.direction === "asc" ? "desc" : "asc",
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
      (patient) =>
        patient.firstname.toLowerCase() === patientfName.toLowerCase() ||
        patient.patientID === patientID
    );

    if (isDuplicate) {
      setNotification("Patient already exists");
      setTimeout(() => setNotification(""), 3000);
      return; // Stop execution if duplicate found
    }

    // Get token from cookies (assuming you're using js-cookie)
  const token = Cookies.get("token"); // Ensure 'js-cookie' is imported

  if (!token) {
    setNotification("Unauthorized: Please login first.");
    setTimeout(() => setNotification(""), 3000);
    return;
  }

  const newPatient = {
    patient_ID: patientID, // Set patient_ID from form input
    password: patientDOB.replace(/-/g, ""), // Set temporary password as Date of Birth (YYYYMMDD)
    firstname: patientfName,
    dob: patientDOB,
    middleInitial: patientMiddleName,
    lastname: patientLName,
    contact_number: patientContact,
    address: patientAddress,
    civil_status: patientCivilStatus,
    religion: patientReligion,
    nationality: patientNationality,
    age: patientAge,
    gender: patientGender,
    needsPasswordReset: true, // Flag to force password change
  };

  try {
    const response = await fetch("http://localhost:5000/user/add-patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Set Authorization header
      },
      body: JSON.stringify(newPatient),
    });

    const responseData = await response.json();

    if (!response.ok) {
      setNotification(responseData.message || "Failed to add patient.");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    setPatients((prevPatients) => [...prevPatients, responseData]);
    setNotification("Patient added successfully");
    setTimeout(() => setNotification(""), 3000);

    // Clear form fields and close the modal
    setIsOpen(false);
    setPatientID("");
    setPatientFName("");
    setPatientMiddleName("");
    setPatientLName("");
    setPatientContact("");
    setPatientAddress("");
    setPatientDOB("");
    setPatientCivilStatus("");
    setPatientReligion("");
    setPatientNationality("");
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
      patient_id,
      firstname: patientfName,
      age: patientAge,
      gender: patientGender,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/patientname/${patient_id}`,
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
          patient.patient_id === responseData.patient_id
            ? responseData
            : patient
        )
      );

      setFilteredPatients((prevFiltered) =>
        prevFiltered.map((patient) =>
          patient.patient_id === responseData.patient_id
            ? responseData
            : patient
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
    setPatientID(patient.patient_id);
    setPatientfName(patient.firstname);
    setPatientAge(patient.age);
    setPatientGender(patient.gender);
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
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
                    {isEditing ? "Update Patient" : "Patient Information"}
                  </h2>
                </>
              }
              body={
                <>
                  {selectedPatient ? (
                    <div className="patient-info">
                      <p>
                        <strong>Patient ID:</strong>{" "}
                        {selectedPatient.patient_id}
                      </p>
                      <p>
                        <strong>Name:</strong> {selectedPatient.firstname}{" "}
                        {selectedPatient.middleInitial}{" "}
                        {selectedPatient.lastname}
                      </p>
                      <p>
                        <strong>Contact:</strong>{" "}
                        {selectedPatient.contactNumber}
                      </p>
                      <p>
                        <strong>Address:</strong> {selectedPatient.homeAddress}
                      </p>
                      <p>
                        <strong>DOB:</strong> {selectedPatient.dob}
                      </p>
                      <p>
                        <strong>Civil Status:</strong>{" "}
                        {selectedPatient.civilStatus}
                      </p>
                      <p>
                        <strong>Religion:</strong> {selectedPatient.religion}
                      </p>
                      <p>
                        <strong>Nationality:</strong>{" "}
                        {selectedPatient.nationality}
                      </p>
                      <p>
                        <strong>Age:</strong> {selectedPatient.age}
                      </p>
                      <p>
                        <strong>Gender:</strong> {selectedPatient.gender}
                      </p>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setIsOpen(false);
                          setSelectedPatient(null);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <div
                      className="form-container"
                      style={{ maxWidth: "100%" }}
                    >
                      <div className="form-wrapper">
                        <div className="form-content">
                          <form
                            onSubmit={
                              isEditing ? handleUpdatePatient : handleAddPatient
                            }
                          >
                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label className="form-label">
                                  Patient ID:
                                </label>
                                <input
                                  id="patientID"
                                  type="text"
                                  className="form-control"
                                  value={patientID}
                                  onChange={(e) => setPatientID(e.target.value)}
                                  readOnly={isEditing}
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label className="form-label">
                                  First Name:
                                </label>
                                <input
                                  id="patientfName"
                                  type="text"
                                  className="form-control"
                                  value={patientfName}
                                  onChange={(e) =>
                                    setPatientfName(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label className="form-label">
                                  Middle Initial:
                                </label>
                                <input
                                  id="patientMiddleName"
                                  type="text"
                                  className="form-control"
                                  value={patientMiddleName}
                                  onChange={(e) =>
                                    setPatientMiddleName(e.target.value)
                                  }
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label className="form-label">Last Name:</label>
                                <input
                                  id="patientlastName"
                                  type="text"
                                  className="form-control"
                                  value={patientlastName}
                                  onChange={(e) =>
                                    setPatientlastName(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label className="form-label">
                                  Contact Number:
                                </label>
                                <input
                                  id="patientContact"
                                  type="text"
                                  className="form-control"
                                  value={patientContact}
                                  onChange={(e) =>
                                    setPatientContact(e.target.value)
                                  }
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label className="form-label">
                                  Home Address:
                                </label>
                                <input
                                  id="patientAddress"
                                  type="text"
                                  className="form-control"
                                  value={patientAddress}
                                  onChange={(e) =>
                                    setPatientAddress(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label className="form-label">
                                  Date of Birth:
                                </label>
                                <input
                                  id="patientDOB"
                                  type="date"
                                  className="form-control"
                                  value={patientDOB}
                                  onChange={(e) =>
                                    setPatientDOB(e.target.value)
                                  }
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label className="form-label">
                                  Civil Status:
                                </label>
                                <input
                                  id="patientCivilStatus"
                                  type="text"
                                  className="form-control"
                                  value={patientCivilStatus}
                                  onChange={(e) =>
                                    setPatientCivilStatus(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label className="form-label">Religion:</label>
                                <input
                                  id="patientReligion"
                                  type="text"
                                  className="form-control"
                                  value={patientReligion}
                                  onChange={(e) =>
                                    setPatientReligion(e.target.value)
                                  }
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label className="form-label">
                                  Nationality:
                                </label>
                                <input
                                  id="patientNationality"
                                  type="text"
                                  className="form-control"
                                  value={patientNationality}
                                  onChange={(e) =>
                                    setPatientNationality(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label className="form-label">Age:</label>
                                <input
                                  id="patientAge"
                                  type="number"
                                  className="form-control"
                                  value={patientAge}
                                  onChange={(e) =>
                                    setPatientAge(e.target.value)
                                  }
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label className="form-label">Gender:</label>
                                <input
                                  id="patientGender"
                                  type="text"
                                  className="form-control"
                                  value={patientGender}
                                  onChange={(e) =>
                                    setPatientGender(e.target.value)
                                  }
                                />
                              </div>
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
                                  setPatientMiddleName("");
                                  setPatientlastName("");
                                  setPatientContact("");
                                  setPatientAddress("");
                                  setPatientDOB("");
                                  setPatientCivilStatus("");
                                  setPatientReligion("");
                                  setPatientNationality("");
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
                  )}
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
                        <th onClick={() => handleSort("age")}>
                          Age{" "}
                          {sortConfig.key === "age"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    {/*table body*/}
                    <tbody>
                      {filteredPatients.map((i) => {
                        return (
                          <tr key={i._id} onClick={() => handleRowClick(i)}>
                            <td>{i.patientID}</td>
                            <td>{i.firstname}</td>
                            <td>{i.gender}</td>
                            <td>{i.age}</td>
                            <td>
                              <button
                                className="btn btn-warning"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(i);
                                }}
                              >
                                Update
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePatient(i._id);
                                }}
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
