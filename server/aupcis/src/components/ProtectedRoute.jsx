import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // fetch protected data
    const getUserRole = async () => {
      try {
        const response = await axios.get("http://localhost:3000/protected-data", {
          withCredentials: true,
        });
        setUserRole(response.data.user.role);
      } catch (error) {
        console.error("Not authorized", error);
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
  }, []);

  // Show loading while fetching role
  if (loading) return <div>Loading...</div>;

  // If the role is not allowed, redirect to home
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;