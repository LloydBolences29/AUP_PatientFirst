import React from 'react'
import Sidebar from '../../components/Sidebar';
import SearchBar from '../../components/SearchBar';

const CashierDashboard = () => {
    const pharmasidebarLinks = [
        {
          label: "Cashier Dashboard",
          path: "/cashier-dashboard",
        },
        {
          label: "Transaction",
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
                    <h1>Cashier</h1>
        
                    <div className="search-div">
                      <h1>This is cashier dashboard</h1>
        
                        {/* <SearchBar 
                        searchWords={medicines}
                        setFilteredSearchWord={setFilteredmeds}
                        ></SearchBar> */}
                    </div>
                    </>
                }
                
                ></Sidebar>

      
    </div>
  )
}

export default CashierDashboard
