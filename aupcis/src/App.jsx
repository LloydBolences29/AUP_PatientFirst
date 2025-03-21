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

      <Route element={<ProtectedRoute allowedRoles={["Nurse"]} />}>
        <Route path="/nurse-dashboard" element={<NursingDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Nurse"]} />}>
        <Route path="/patient-management" element={<Nursing />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/admin-management" element={<AdminRoleManagement />} />
      </Route>
    </Routes>
  );
}
