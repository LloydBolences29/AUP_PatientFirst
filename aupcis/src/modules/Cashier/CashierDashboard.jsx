import React from 'react'
import Sidebar from '../../components/Sidebar';
import SearchBar from '../../components/SearchBar';

const CashierDashboard = () => {
    const cashierSidebarLinks = [
        {
          label: "Cashier Dashboard",
          path: "/cashier-dashboard",
        },

        {
          label: "Billing",
          path: "/cashier-billing",
        },
      ];
  return (
    <div>
        <Sidebar
                links={cashierSidebarLinks}
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
