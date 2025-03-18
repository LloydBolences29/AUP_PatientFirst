import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create Auth Context
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data (to persist login state)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("Auth error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = async (credentials, isStaff) => {
    const url = isStaff
      ? "http://localhost:3000/staff/login"
      : "http://localhost:3000/patient/login";

    const response = await axios.post(url, credentials, {
      withCredentials: true,
    });

    setUser(response.data.user);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("allowedPages", JSON.stringify(response.data.allowedPages));

    return response.data;
  };

  // Logout function
  const logout = async () => {
    await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
    setUser(null);
    localStorage.removeItem("role");
    localStorage.removeItem("allowedPages");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);