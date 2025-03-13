import React from 'react'
import Sidebar from '../../components/Sidebar';
import SearchBar from '../../components/SearchBar';
import { useState, useEffect } from 'react';

const Pharma = ({medicines}) => {
    const [filteredmeds, setFilteredmeds] = useState(medicines);

    useEffect(() => {
        setFilteredPatients(medicines);
      }, [medicines]);


    const pharmasidebarLinks = [
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


  return (
    <div>
        <Sidebar
        props={pharmasidebarLinks}
        activeLink="Dashboard"
        pageContent={
            <>
            <h1>Pharmacy</h1>

            <div className="search-div">

                <SearchBar 
                searchWords={medicines}
                setFilteredSearchWord={setFilteredmeds}
                ></SearchBar>
            </div>
            </>
        }
        
        ></Sidebar>
      
    </div>
  )
}

export default Pharma
