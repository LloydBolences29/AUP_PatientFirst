import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

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
        // 🔹 Fetch user session from the backend (JWT in HTTP-only cookies)
        const response = await axios.get("https://localhost:3000/api/auth/me", {
          withCredentials: true, // ✅ This sends the stored cookie automatically
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
      ? "https://localhost:3000/staff/login"
      : "https://localhost:3000/patient/login";

    const response = await axios.post(url, credentials, {
      withCredentials: true,
    });

    console.log("🟢 Login response:", response.data);

    // ✅ Properly store user data
    const newUser = {
      role: response.data.role,
      role_ID: response.data.role_ID || response.data.patient_ID,
      allowedPages: response.data.allowedPages,
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("allowedPages", JSON.stringify(response.data.allowedPages));

    return response.data;
  };

  // Logout function
  const logout = async () => {
    await axios.post("https://localhost:3000/auth/logout", {}, { withCredentials: true });
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("allowedPages");
    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
