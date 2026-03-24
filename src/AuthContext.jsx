import React, { createContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { getToken, isLoaded: authLoaded } = useAuth();
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const syncAuth = async () => {
      if (userLoaded && authLoaded) {
        if (clerkUser) {
          const jwt = await getToken();
          setToken(jwt);
          setUser({
            name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || "Student",
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress
          });
        } else {
          setToken(null);
          setUser(null);
        }
        setIsLoaded(true);
      }
    };
    syncAuth();
  }, [clerkUser, userLoaded, authLoaded, getToken]);

  // Compatibility functions (no-ops for Clerk)
  const login = () => {};
  const logout = () => {};

  if (!isLoaded) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, clerkUser }}>
      {children}
    </AuthContext.Provider>
  );
};
