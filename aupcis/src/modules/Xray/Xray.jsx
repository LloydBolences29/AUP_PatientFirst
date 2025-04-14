import React from 'react'
import Sidebar from '../../components/Sidebar'

const Xray = () => {
    const xraySidebarLinks = [
        { label: "Dashboard", path: "/xray-dashboard" },
        { label: "Billing", path: "/xray-billing" },
        
      ];

  return (
    <div>
        <Sidebar links={xraySidebarLinks} pageContent={<> <h1>This is the Xray Dashboard</h1></>} />
      
    </div>
  )
}

export default Xray
