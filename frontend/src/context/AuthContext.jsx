import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // logged-in user
  const [token, setToken] = useState(null);    // JWT token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on refresh
    const storedUser = localStorage.getItem("labourlink_user");
    const storedToken = localStorage.getItem("labourlink_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("labourlink_user", JSON.stringify(userData));
    localStorage.setItem("labourlink_token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("labourlink_user");
    localStorage.removeItem("labourlink_token");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
