import React from 'react'
import Sidebar from '../../components/Sidebar';
import { useState, useEffect } from 'react';

const Pharma = ({medicines}) => {
    const [filteredmeds, setFilteredmeds] = useState(medicines);

    useEffect(() => {
        setFilteredmeds(medicines);
    }, [medicines]);

    const handleSearch = (searchTerm) => {
        const filtered = medicines.filter((med) =>
            med.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredmeds(filtered);
    };

    const pharmasidebarLinks = [
        {
          label: "Pharmacy Dashboard",
          path: "/pharma-dashboard",
        },
        {
          label: "Medicine List",
          path: "/medicine-list",
        },
        {
          label: "Stock Management ",
          path: "/medicine-inventory",
        },
        {
          label: "Transaction History",
          path: "/pharma-transaction-history",
        },
        {
          label: "Analytics and Reports",
          path: "/pharma-analytics",
        }
      ];


  return (
    <div>
        <Sidebar
        props={pharmasidebarLinks}
        activeLink="Dashboard"
        pageContent={
            <>
            <h1>Pharmacy</h1>

            {/* <div className="search-div">
                <SearchBar 
                searchWords={medicines.map(med => med.name)}
                onSearch={handleSearch}
                />
            </div> */}

            <div className="medicine-table">
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                    </tbody>
                </table>
            </div>
            </>
        }
        
        ></Sidebar>
      
    </div>
  )
}

export default Pharma
