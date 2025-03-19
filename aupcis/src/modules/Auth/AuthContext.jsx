import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allowedPages, setAllowedPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ...existing code...
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, allowedPages, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);