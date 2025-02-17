import React from 'react'
import { NavLink } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import './Navbar.css'


export const Navbar = () => {
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
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/">
                      About
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/services">
                      Services
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login-register">
                      Login/Register
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
      
    </>
  )
}

export default Navbar
