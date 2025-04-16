import React from 'react'
import Sidebar from '../../components/Sidebar';

const LabBilling = () => {
    const labSidebarLinks = [
        { label: "Dashboard", path: "/lab-dashboard" },
        { label: "Billing", path: "/lab-billing" },
        { label: "Upload", path: "/lab-upload" },
      ];
  return (
    <div>

        <Sidebar links={labSidebarLinks} pageContent={<> <h1>This is the Lab Billing</h1></>} />
      
    </div>
  )
}

export default LabBilling
