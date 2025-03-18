import React from 'react'

const CashierDashboard = () => {
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
                    <h1>Cashier</h1>
        
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

export default CashierDashboard
