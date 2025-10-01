'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { saveUser, onUsersSnapshot, initializeFirebase } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import type { Firestore } from 'firebase/firestore';

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
  const [db, setDb] = useState<Firestore | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { db: firestoreDb } = initializeFirebase();
    setDb(firestoreDb);

    try {
      const storedUser = localStorage.getItem('userProfile');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserState(parsedUser);
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!db) return;

    const unsubscribe = onUsersSnapshot(db, (users) => {
      setAllUsers(users as UserProfile[]);
    });

    return () => unsubscribe();
  }, [db]);
  
  const setUser = (profile: Omit<UserProfile, 'id'>) => {
    if (!db) return;
    
    const userProfile: UserProfile = { id: user?.id || uuidv4(), ...profile };
    
    setUserState(userProfile);
    
    try {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
    
    saveUser(db, userProfile);
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
