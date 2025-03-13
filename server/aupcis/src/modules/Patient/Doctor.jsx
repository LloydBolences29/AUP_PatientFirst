import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./Doctor.css";
import Card from "../../components/Card";

const Doctor = () => {
  //for sidebar links
  const sidebarLinks = [
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

  const doctor_name = [
    {
      name: "Dr. John Doe",
      container_class: "genDoc",
      description: "General Doctor",
    },
    {
      name: "Dr. Jane Doe",
      container_class: "physician",
      description: "Physician Doctor",
    },
    {
      name: "Dr. Lee Doe",
      container_class: "dental",
      description: "Dental Doctor",
    },
    {
      name: "Dr. Smith Doe",
      container_class: "cardio",
      description: "Cardiologist Doctor",
    },
  ];

  //fething the doctor's data from mongodb

  //useState
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3000");
      const data = await res.json();
      setDoctors(data.items);
    };
    fetchData();
  });
  //   {doctors.map(i =>(
  //     <p>{i.name}, {i.description}</p>
  // ))}
  const [active, setActive] = useState(false);
  const handleClick = () => {
    <style></style>;
    setActive(!active);
  };

  return (
    <>
      <Sidebar
        props={sidebarLinks}
        activeLink="Doctor's Page"
        pageContent={
          <>
            <div className="doctor-content-container">
              <div className="doctor-specialty">
                {doctor_name.map((i) => (
                  <div className={`${i.container_class}-btn-wrapper`}>
                    <button className="btn btn-outline-primary">
                      {i.description}
                    </button>
                  </div>
                ))}
              </div>

              <div className="doctor-profile">
                {doctor_name.map((data) => (
                  <div className="doctor-card">
                    <Card
                      cardBody={
                        <>
                          <h4 className="card-title">{data.name}</h4>
                          <p className="card-text">{data.description}</p>
                        </>
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        }
      ></Sidebar>
    </>
  );
};

export default Doctor;
