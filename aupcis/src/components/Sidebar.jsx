
import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import Navbar from "../modules/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export const Sidebar = ({ props, pageContent }) => {
  const navigate = useNavigate();
  let mySidebarFunction = (item, index) => 
  (
    <li key={index} className={`sidebar-item ${item.subMenu ? "dropdown" : ""}`}>
          {item.subMenu ? (
            // Dropdown Menu
            <>
              <a
                className="sidebar-link dropdown-toggle"
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
              `sidebar-link ${isActive ? "active" : ""}`
            }
            to={item.path}
            >
              {item.label}
            </NavLink>
          )}
        </li>
  );

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/staff/logout", {
        method: "POST",
        credentials: "include", // Required to include cookies in the request
      });

      if (response.ok) {
        navigate("/login"); // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
    
  return (
    <>
      <div className="sidebar-wrapper">
        <div className="logo-wrapper container">
          <p className="logo-text">
            <span className="sidebar-patient-Logo">Patient</span>
            <span className="sidebar-first-Logo">First</span>
          </p>

          <div className="menu-links">
            <div className="list-links-wrapper">
              <ul className="list-links">{props.map(mySidebarFunction)}</ul>
            </div>
          </div>

          <div className="user-menu-container">
            <div className="user-menu">
              <ul className="user-menu-list-wrapper">
                <NavLink to={"/"} className="user-menu-list">Settings</NavLink>
                <NavLink to={"/"} className="user-menu-list">Feedback</NavLink>
                <NavLink to={"/"} onClick={handleLogout} className="user-menu-list">Log Out</NavLink>
              </ul>
            </div>
          </div>
        </div>

        <div className="content">{pageContent}

        </div>
      </div>
    </>
  );
};

export default Sidebar;
