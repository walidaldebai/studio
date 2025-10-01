
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { saveUser, onUsersSnapshot } from '@/lib/firebase';
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
  allUsers: UserProfile[];
  isAdmin: boolean;
  isLoaded: boolean;
  setUser: (user: Omit<UserProfile, 'id'>) => void;
  setAdminStatus: (status: boolean) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const initialize = () => {
      try {
        const storedUser = localStorage.getItem('userProfile');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Ensure user has an ID
          if (!parsedUser.id) {
            parsedUser.id = uuidv4();
            localStorage.setItem('userProfile', JSON.stringify(parsedUser));
            saveUser(parsedUser);
          }
          setUserState(parsedUser);
        }
      } catch (error) {
        console.error("Failed to access localStorage", error);
      } finally {
        setIsLoaded(true);
      }
    };

    initialize();

    const unsubscribe = onUsersSnapshot((users) => {
      setAllUsers(users as UserProfile[]);
    });

    return () => unsubscribe();
  }, []);
  
  const setUser = (profile: Omit<UserProfile, 'id'>) => {
    // Check for existing ID from state, or generate a new one.
    const userId = user?.id || uuidv4();
    const userProfile: UserProfile = { id: userId, ...profile };
    
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
    <UserContext.Provider value={{ user, allUsers, setUser, isAdmin, setAdminStatus, isLoaded, logout }}>
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
