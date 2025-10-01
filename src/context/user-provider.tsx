
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  name: string;
  gender: string;
  specialization: string;
  healthIssues?: string;
}

interface UserContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoaded: boolean;
  setUser: (user: UserProfile | null) => void;
  setAdminStatus: (status: boolean) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const initialize = () => {
      try {
        const storedUser = localStorage.getItem('userProfile');
        if (storedUser) {
          setUserState(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to access localStorage", error);
      } finally {
        setIsLoaded(true);
      }
    };

    initialize();
  }, []);
  
  const setUser = (user: UserProfile | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('userProfile', JSON.stringify(user));
    } else {
      localStorage.removeItem('userProfile');
    }
  };

  const setAdminStatus = (status: boolean) => {
    setIsAdmin(status);
  };
  
  const logout = () => {
    setUser(null);
    setIsAdmin(false); // Also clear admin status on logout
    localStorage.removeItem('userProfile');
    router.push('/onboarding');
  }

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, setAdminStatus, isLoaded, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
