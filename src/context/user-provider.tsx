"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  name: string;
  gender: string;
  specialization: string;
  healthIssues?: string;
}

export interface Feedback {
  id: number;
  name: string;
  feedback: string;
}

interface UserContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoaded: boolean;
  feedback: Feedback[];
  setUser: (user: UserProfile | null) => void;
  setAdminStatus: (status: boolean) => void;
  addFeedback: (feedback: { name: string; feedback: string }) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userProfile');
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }
      const storedAdminStatus = localStorage.getItem('isAdmin');
      if (storedAdminStatus) {
        setIsAdmin(JSON.parse(storedAdminStatus));
      }
      const storedFeedback = localStorage.getItem('feedback');
      if (storedFeedback) {
        setFeedback(JSON.parse(storedFeedback));
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
    } finally {
      setIsLoaded(true);
    }
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
    localStorage.setItem('isAdmin', JSON.stringify(status));
  };

  const addFeedback = (newFeedback: { name: string; feedback: string }) => {
    const feedbackWithId = { ...newFeedback, id: Date.now() };
    const updatedFeedback = [...feedback, feedbackWithId];
    setFeedback(updatedFeedback);
    localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
  };
  
  const logout = () => {
    setUser(null);
    setAdminStatus(false);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isAdmin');
    // Keep feedback for demo purposes
    router.push('/onboarding');
  }

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, setAdminStatus, isLoaded, feedback, addFeedback, logout }}>
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
