import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Navbar.css";
import { useState, useEffect } from "react";

export const Navbar = ({ myProps }) => {
  const propitems = myProps;

  let myFunction = (item, index) => (
    <li key={index} className={`nav-item ${item.subMenu ? "dropdown" : ""}`}>
      {item.subMenu ? (
        // Dropdown Menu
        <>
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id={`dropdown-${index}`}
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {item.label}
          </a>
          <ul className="dropdown-menu" aria-labelledby={`dropdown-${index}`} data-bs-auto-close="outside">
            {item.subMenu.map((subItem, subIndex) => (
              <li key={subIndex}>
                <NavLink className="dropdown-item" to={subItem.path}>
                  {subItem.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </>
      ) : (
        // Regular Links
        <NavLink
        className={({ isActive }) =>
          `nav-link ${isActive ? "active" : ""}`
        }
        to={item.path}
        >
          {item.label}
        </NavLink>
      )}
    </li>
  );

  // const [expanded, setExpanded] = useState(false); // State to track collapse

  // useEffect(() => {
  //   const navbarToggler = document.querySelector(".navbar-toggler");
  //   const navbarCollapse = document.querySelector("#navbarNav");

  //   // Manually toggle the expanded state for the navbar
  //   const handleToggle = () => {
  //     setExpanded((prev) => !prev); // Toggle the expanded state
  //   };

  //   navbarToggler?.addEventListener("click", handleToggle);
  //   return () => navbarToggler?.removeEventListener("click", handleToggle);
  // }, []);

  // console.log("Navbar Props:", myProps);

  return (
    <>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <NavLink className="logo-text navbar-brand text-dark" to="/">
              <span className="patient-Logo">Patient</span>
              <span className="first-Logo">First</span>
            </NavLink>
            {/* <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button> */}
            <div className=" navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">{propitems.map(myFunction)}</ul>
            </div>
          </div>

      </nav>
    </>
  );
};

export default Navbar;


// {`   ${expanded ? "show" : ""}`}

//<>
//<nav className="navbar navbar-expand-lg navbar-light">
//     <div className="container-fluid">
//       <NavLink className="logo-text navbar-brand text-dark" to="/">
//         <span className="patient-Logo">Patient</span>
//         <span className="first-Logo">First</span>
//       </NavLink>
//       <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//       <div className=" collapse navbar-collapse" id="navbarNav">
//         <ul className="navbar-nav ms-auto">
//           <li className="nav-item">
//             <NavLink className="nav-link" to="/">
//               About
//             </NavLink>
//           </li>
//           <li className="nav-item">
//             <NavLink className="nav-link" to="/services">
//               Services
//             </NavLink>
//           </li>
//           <li className="nav-item">
//             <NavLink className="nav-link" to="/login-register">
//               Login/Register
//             </NavLink>
//           </li>
//         </ul>
//       </div>
//     </div>