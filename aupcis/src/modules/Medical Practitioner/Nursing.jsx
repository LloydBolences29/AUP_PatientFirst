import React from "react";
import Sidebar from "../../components/Sidebar";
import './Nursing.css'

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
        }
  ]
    }
  
  ];
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
                      <input id="patientSearchField" type="search" placeholder="Search" className="form-control search-field" />
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
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Sex</th>
                        <th>D.O.B.</th>
                        <th>Nationality</th>
                        <th>Religion</th>
                        <th>Address</th>
                      </tr>
                    </thead>
                    

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
