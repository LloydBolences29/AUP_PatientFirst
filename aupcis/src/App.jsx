import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./modules/Route/ProtectedRoute.jsx";
import { useAuth } from "./modules/Route/AuthContext.jsx";

// Pages
import Home from "./modules/Home/Home";
import LogInPage from "./modules/Home/LogInPage";
import Unauthorized from "./modules/Route/Unauthorized.jsx";
import AdminDashboard from "./modules/Admin/AdminDashboard.jsx";
import Dashboard from "./modules/Patient/Dashboard.jsx";
import CashierDashboard from "./modules/Cashier/CashierDashboard.jsx";
import PharmaDashboard from "./modules/Pharma/Pharma.jsx";
import AdminRoleManagement from "./modules/Admin/AdminRoleManagement.jsx";
import Nursing from "./modules/Medical Practitioner/Nursing.jsx";
import NursingDashboard from "./modules/Medical Practitioner/NursingDashboard.jsx";
import PatientProfile from "./modules/Patient/PatientProfile.jsx"
import PharmaMedicines from "./modules/Pharma/MedicineMngt.jsx"
import PharmacyTransactions from "./modules/Pharma/PharmacyTransactions.jsx";
import MedicalRecordDashboard from "./modules/MRO/MedicalRecordDashboard.jsx";
import MedicalRecordManagement from "./modules/MRO/MROMngt.jsx"
import SymptomChecker from "./modules/Infermedica/SymptomChecker.jsx";
import DoctorDashboard from "./modules/Medical Practitioner/Doctors.jsx"
import DoctorPatientManagement from "./modules/Medical Practitioner/DoctorPatient.jsx"
import Prescription from "./modules/Pharma/Prescriptions.jsx";
import CashierBilling from "./modules/Cashier/CashierBilling.jsx";
import XrayDashboard from "./modules/Xray/Xray.jsx"
import XrayBilling from "./modules/Xray/XrayBilling.jsx";
import XrayUpload from "./modules/Xray/XrayUpload.jsx";
import LabDashboard from "./modules/Lab/LabDashboard.jsx";
import LabBilling from "./modules/Lab/LabBilling.jsx";
import Queue from "./modules/Medical Practitioner/Queue.jsx";
import PharmacyAnalytics from "./modules/Admin/PharmacyAnalytics.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LogInPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />


      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Patient"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Patient"]} />}>
      <Route path="/profile/:id" element={<PatientProfile />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Patient"]} />}>
      <Route path="/symptomChecker" element={<SymptomChecker />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Nurse"]} />}>
        <Route path="/nurse-dashboard" element={<Queue />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Nurse"]} />}>
        <Route path="/patient-management" element={<Nursing />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
        <Route path="/doctor-patient-management" element={<DoctorPatientManagement />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/admin-management" element={<AdminRoleManagement />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/pharmacyAnalytics" element={<PharmacyAnalytics />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Cashier"]} />}>
        <Route path="/cashier-dashboard" element={<CashierDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Cashier"]} />}>
        <Route path="/cashier-billing" element={<CashierBilling />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Pharmacist"]} />}>
        <Route path="/pharma-dashboard" element={<PharmaDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Pharmacist"]} />}>
        <Route path="/medicine-list" element={<PharmaMedicines />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Pharmacist"]} />}>
        <Route path="/pharma-transaction" element={<PharmacyTransactions />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Pharmacist"]} />}>
        <Route path="/prescription-page" element={<Prescription />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["MedicalRecordsOfficer"]} />}>
        <Route path="/medicalRecord-dashboard" element={<MedicalRecordDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["MedicalRecordsOfficer"]} />}>
        <Route path="/medicalRecord-management" element={<MedicalRecordManagement />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Radiologist"]} />}>
        <Route path="/xray-dashboard" element={<XrayDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Radiologist"]} />}>
        <Route path="/xray-billing" element={<XrayBilling />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Radiologist"]} />}>
        <Route path="/xray-upload" element={<XrayUpload />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["lab"]} />}>
        <Route path="/lab-dashboard" element={<LabDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["lab"]} />}>
        <Route path="/lab-billing" element={<LabBilling />} />
      </Route>

    </Routes>
  );
}
