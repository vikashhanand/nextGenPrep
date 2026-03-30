"use client";

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('ngp_token') : null;
    if (storedToken) {
      setToken(storedToken);
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (payload && payload.id) {
          setUser({ name: payload.name || 'User', id: payload.id });
        }
      } catch (e) {
        console.error("Token parsing error:", e);
        logout();
      }
    }
    setIsLoaded(true);
  }, []);

  const login = (userData, jwtToken) => {
    localStorage.setItem('ngp_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ngp_token');
    setToken(null);
    setUser(null);
  };

  if (!isLoaded) return null;

  return (
    <AuthContext.Provider value={{ user, token, isLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
