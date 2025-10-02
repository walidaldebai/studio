
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { saveUser } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export interface UserProfile {
  id: string;
  name: string;
  gender: string;
  specialization: string;
  healthIssues?: string;
}

interface UserContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoaded: boolean;
  setUser: (user: Omit<UserProfile, 'id'> | UserProfile) => void;
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
    try {
      const userJson = localStorage.getItem('userProfile');
      if (userJson) {
        setUserState(JSON.parse(userJson));
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);
  
  const setUser = (profile: Omit<UserProfile, 'id'> | UserProfile) => {
    let userProfile: UserProfile;

    if ('id' in profile) {
      userProfile = profile;
    } else {
      const newId = user?.id || uuidv4();
      userProfile = { id: newId, ...profile };
    }
    
    setUserState(userProfile);
    
    try {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
    
    saveUser(userProfile);
  };

  const setAdminStatus = (status: boolean) => {
    setIsAdmin(status);
  };
  
  const logout = () => {
    setUserState(null);
    setIsAdmin(false);
    try {
      localStorage.removeItem('userProfile');
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
    }
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
