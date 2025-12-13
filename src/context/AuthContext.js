// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, isLoggedIn, logout as doLogout } from "../API/Auth";
import { useCart } from "./CartContext";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();
  useEffect(() => {
    const checkAuth = async () => {
      if (isLoggedIn()) {
        const currentUser = getCurrentUser();
        setUser(currentUser); 
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const logout = () => {
    doLogout();
      clearCart();
    setUser(null);
  };

  const loginUser = (userData) => {
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};

  return (
    <AuthContext.Provider value={{ user, loading, logout, loginUser }}>
      {!loading&&children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);