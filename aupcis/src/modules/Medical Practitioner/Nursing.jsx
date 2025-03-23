import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./Nursing.css";
import Modal from "../../components/Modal";
import Cookies from "js-cookie";

const Nursing = () => {
  const nurseSidebarLinks = [
    {
      label: "Dashboard",
      path: "/nurse-dashboard",
    },
    {
      label: "Patient Management",
      path: "/patient-management",
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
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false); // State for visit modal
  const [visitData, setVisitData] = useState({
    temperature: "",
    heartRate: "",
    pulseRate: "",
  });

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
    if (!patients || patients.length === 0) return; // Prevents running filter on empty data

    setFilteredPatients(
      patients.filter((patient) => {
        const firstName =
          typeof patient.firstname === "string"
            ? patient.firstname.toLowerCase()
            : "";
        const age = patient.age ? patient.age.toString() : "";

        return (
          firstName.includes(searchTerm.toLowerCase()) ||
          age.includes(searchTerm)
        );
      })
    );
  }, [searchTerm, patients]);

  const handleAddPatient = async (e) => {

    e.preventDefault();
    const formattedDate = new Date(patientDOB).toISOString().split("T")[0];

    // Check if patient already exists in state (before making API call)
    const isDuplicate = patients.some(
      (patient) =>
        (patient.firstname &&
          patient.firstname.toLowerCase() === patientfName.toLowerCase()) ||
        patient.patientID === patientID
    );

    if (isDuplicate) {
      setNotification("Patient already exists");
      setTimeout(() => setNotification(""), 3000);
      return; // Stop execution if duplicate found
    }

    // ❌ REMOVE this because cookies are HTTP-only (not accessible in JS)
    // const token = Cookies.get("token");

    // ❌ No need to check for token manually, browser will handle it

    const newPatient = {
      patientID: patientID, // Set patient_ID from form input
      password: patientReligion, // Set temporary password as Date of Birth (YYYYMMDD)
      firstname: patientfName,
      dob: formattedDate,
      middleInitial: patientMiddleName,
      lastname: patientlastName,
      contact_number: patientContact,
      home_address: patientAddress,
      civil_status: patientCivilStatus,
      religion: patientReligion,
      nationality: patientNationality,
      age: patientAge,
      gender: patientGender,
      needsPasswordReset: true, // Flag to force password change
    };

    try {
      const response = await fetch(
        "http://localhost:3000/patient/add-patient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // ❌ REMOVE manually setting Authorization header
          },
          credentials: "include", // ✅ Ensure cookies are sent with the request
          body: JSON.stringify(newPatient),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        setNotification(responseData.message || "Failed to add patient.");
        setTimeout(() => setNotification(""), 3000);
        return;
      }

      setPatients((prevPatients) => [...prevPatients, responseData.patient]);
      setNotification("Patient added successfully");
      console.log(responseData.patient);

      setTimeout(() => setNotification(""), 3000);

      console.log("Updating patient with ID:", patientID);

      // Clear form fields and close the modal
      setIsOpen(false);
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
    } catch (error) {
      console.error("Error adding patient:", error);
      setNotification("An error occurred. Please try again.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();

    const updatedPatient = {
      patient_id: patientID, // Corrected variable name
      firstname: patientfName,
      age: patientAge,
      gender: patientGender,
    };
    console.log("Updating patient with ID:", patientID);

    try {
      const response = await fetch(
        `http://localhost:3000/patientname/${patientID}`, // Corrected variable name
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
          patient.patient_id === responseData.patient_id ? responseData : patient
        )
      );

      setFilteredPatients((prevFiltered) =>
        prevFiltered.map((patient) =>
          patient.patient_id === responseData.patient_id ? responseData : patient
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
    setPatientMiddleName(patient.middleInitial || ""); // Handle optional fields
    setPatientlastName(patient.lastname || "");
    setPatientContact(patient.contact_number || "");
    setPatientAddress(patient.home_address || "");
    setPatientDOB(patient.dob || "");
    setPatientCivilStatus(patient.civil_status || "");
    setPatientReligion(patient.religion || "");
    setPatientNationality(patient.nationality || "");
    setPatientAge(patient.age || "");
    setPatientGender(patient.gender || "");
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
    setIsOpen(true);
  };

  // Handle input changes in the visit form
  const handleVisitInputChange = (e) => {

   
    const { name, value } = e.target;
    setVisitData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for adding a new visit
  const handleAddVisit = async (e) => {
    e.preventDefault();
  
    const newVisit = {
      patient_id: selectedPatient._id, // Use selected patient's ID
      purpose: visitData.purpose, // Purpose of the visit
      blood_pressure: visitData.blood_pressure,
      temperature: visitData.temperature,
      pulse_rate: visitData.pulse_rate,
      respiratory_rate: visitData.respiratory_rate,
      weight: visitData.weight,
    };
  
    try {
      const response = await fetch("http://localhost:3000/patient-visit/create-visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVisit),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        console.error("Error adding visit:", responseData.message);
        setNotification(responseData.message || "Failed to add visit.");
        setTimeout(() => setNotification(""), 3000);
        return;
      }
  
      console.log("Visit added successfully:", responseData);
      setNotification("Visit added successfully.");
      setTimeout(() => setNotification(""), 3000);
  
      // Reset form and close modal
      setIsVisitModalOpen(false);
      setVisitData({
        purpose: "",
        blood_pressure: "",
        temperature: "",
        pulse_rate: "",
        respiratory_rate: "",
        weight: "",
      });
    } catch (error) {
      console.error("Error adding visit:", error);
      setNotification("An error occurred. Please try again.");
      setTimeout(() => setNotification(""), 3000);
    }
  };
  

  const handleAddVisitClick = (patient) => {
    setSelectedPatient(patient); // Set the selected patient details
    setIsVisitModalOpen(true); // Open the visit modal
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
                        {selectedPatient.contact_number}
                      </p>
                      <p>
                        <strong>Address:</strong> {selectedPatient.home_address}
                      </p>
                      <p>
                        <strong>DOB:</strong> {selectedPatient.dob}
                      </p>
                      <p>
                        <strong>Civil Status:</strong>{" "}
                        {selectedPatient.civil_status}
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
                      style={{
                        maxWidth: "100%",
                        maxHeight: "80vh", // Limit modal height
                        overflowY: "auto", // Add scroll for overflow
                      }}
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

            <Modal
              show={isVisitModalOpen}
              title={
                <>
                  <h2 className="modal-title text-center">Add New Visit</h2>
                </>
              }
              body={
                <div
                  className="form-container"
                  style={{
                    maxWidth: "600px", // Set a fixed width for the modal
                    margin: "0 auto", // Center the modal horizontally
                    padding: "20px", // Add padding inside the modal
                    backgroundColor: "#f8f9fa", // Light background color
                    borderRadius: "8px", // Rounded corners
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                    maxHeight: "80vh", // Limit modal height
                    overflowY: "auto", // Add scroll for overflow
                  }}
                >
                  <div className="form-wrapper">
                    <div className="form-content">
                      {/* Display selected patient details */}
                      {selectedPatient && (
                        <div className="patient-details mb-3">
                          <p>
                            <strong>Patient ID:</strong> {selectedPatient.patient_id}
                          </p>
                          <p>
                            <strong>Name:</strong> {selectedPatient.firstname}{" "}
                            {selectedPatient.middleInitial} {selectedPatient.lastname}
                          </p>
                          <p>
                            <strong>Age:</strong> {selectedPatient.age}
                          </p>
                          <p>
                            <strong>Gender:</strong> {selectedPatient.gender}
                          </p>
                        </div>
                      )}
                      <form onSubmit={handleAddVisit}>
                        <div className="form-group">
                          <label className="form-label">Purpose:</label>
                          <select
                            className="form-control"
                            name="purpose"
                            value={visitData.purpose || ""}
                            onChange={handleVisitInputChange}
                          >
                            <option value="">Select Purpose</option>
                            <option value="Checkup">Checkup</option>
                            <option value="Medical Certificate">Medical Certificate</option>
                            <option value="Emergency">Emergency</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Blood Pressure:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="blood_pressure"
                            value={visitData.blood_pressure || ""}
                            onChange={handleVisitInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Temperature:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="temperature"
                            value={visitData.temperature || ""}
                            onChange={handleVisitInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Pulse Rate:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="pulse_rate"
                            value={visitData.pulse_rate || ""}
                            onChange={handleVisitInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Respiratory Rate:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="respiratory_rate"
                            value={visitData.respiratory_rate || ""}
                            onChange={handleVisitInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Weight:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="weight"
                            value={visitData.weight || ""}
                            onChange={handleVisitInputChange}
                          />
                        </div>
                        <br />
                        <div className="btn-container text-center">
                          <button type="submit" className="btn btn-primary mx-2">
                            Submit
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary mx-2"
                            onClick={() => setIsVisitModalOpen(false)}
                          >
                            Close
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              }
            />

            <div className="nurse-div-container container mt-4">
              <div className="nurse-div-wrapper">
                <div className="nurse-div-content">
                  {/* Table for patient data */}
                  <table className="table table-striped table-bordered table-hover">
                    <thead className="thead-dark">
                      <tr>
                        <th onClick={() => handleSort("patient_id")} className="text-center">
                          Patient ID{" "}
                          {sortConfig.key === "patient_id"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th onClick={() => handleSort("firstname")} className="text-center">
                          Name{" "}
                          {sortConfig.key === "firstname"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th onClick={() => handleSort("gender")} className="text-center">
                          Gender{" "}
                          {sortConfig.key === "gender"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th onClick={() => handleSort("age")} className="text-center">
                          Age{" "}
                          {sortConfig.key === "age"
                            ? sortConfig.direction === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>

                    {/* Table body */}
                    <tbody>
                      {filteredPatients.map((i, index) => {
                        return (
                          <tr
                            key={`${i._id || i.patient_id}-${index}`} // Ensure unique key
                            onClick={() => handleRowClick(i)}
                          >
                            <td className="text-center">{i.patient_id}</td>
                            <td className="text-center">{i.firstname}</td>
                            <td className="text-center">{i.gender}</td>
                            <td className="text-center">{i.age}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-warning btn-sm mx-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(i);
                                }}
                              >
                                Update
                              </button>
                              <button
                                className="btn btn-danger btn-sm mx-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePatient(i._id);
                                }}
                              >
                                Delete
                              </button>
                              <button
                                className="btn btn-success btn-sm mx-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddVisitClick(i); // Pass the patient details to the modal
                                }}
                              >
                                Add New Visit
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
