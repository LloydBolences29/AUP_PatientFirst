import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

const MROMngt = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    fetchPatientData()
  }, []);
  const fetchPatientData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/mro/patient-data"
      );
      setVisits(response.data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  const MROsidebarLinks = [
    { label: "Dashboard", path: "/medicalRecord-dashboard" },
    { label: "Patient Management", path: "/medicalRecord-management" },
  ];
  return (
    <div>
      <Sidebar
        links={MROsidebarLinks}
        pageContent={
          <>
            <div className="container mt-4">
              <h2>Medical Records Office Patient Management</h2>
              <div className="mb-3 d-flex justify-content-between">
                <input
                  type="text"
                  className="form-control w-75"
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>{" "}
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                    {visits.map((val) => (
                        <tr key={val.patient_id}>
                            <td>{val.patient_id?.patient_id}</td>
                            <td>{val.patient_id?.firstname} {val.patient_id?.lastname}</td>
                            <td>{val.patient_id?.age}</td>
                            <td>{val.patient_id?.gender}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        }
      />
    </div>
  );
};

export default MROMngt;
