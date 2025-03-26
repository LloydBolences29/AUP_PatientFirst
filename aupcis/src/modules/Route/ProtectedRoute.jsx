import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Cookies from "js-cookie";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // Try getting user role from token (if exists)
  const storedToken = Cookies.get("token");

  if (loading) return <p>Loading...</p>;

  // If no user and no token, redirect to login
  if (!user && !storedToken) {
    return <Navigate to="/login" />;
  }

  // Ensure we have a valid user role
  const userRole = user?.role || null;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
