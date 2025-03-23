import React from 'react'
import Sidebar from '../../components/Sidebar';

const MedicalRecordDashboard = () => {

    const MROsidebarLinks = [
        { label: "Dashboard", path: "/medicalRecord-dashboard" },
        { label: "Patient Management", path: "/medicalRecord-management" }

      ];
  return (
    <div>

        <Sidebar props = {MROsidebarLinks}

        />
      
    </div>
  )
}

export default MedicalRecordDashboard
