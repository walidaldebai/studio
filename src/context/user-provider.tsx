
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
  id: string;
  name: string;
  feedback: string;
  createdAt: string; // Using ISO string for date
}

interface UserContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoaded: boolean;
  feedback: Feedback[];
  setUser: (user: UserProfile | null) => void;
  setAdminStatus: (status: boolean) => void;
  addFeedback: (feedback: { name: string; feedback: string }) => Promise<void>;
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
    const initialize = () => {
      try {
        const storedUser = localStorage.getItem('userProfile');
        if (storedUser) {
          setUserState(JSON.parse(storedUser));
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

  const addFeedback = async (newFeedback: { name: string; feedback: string }) => {
    const response = await fetch('/api/send-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFeedback),
    });

    if (!response.ok) {
      throw new Error('Failed to send feedback');
    }

    const feedbackToAdd: Feedback = {
        ...newFeedback,
        id: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    };

    const updatedFeedback = [...feedback, feedbackToAdd];
    setFeedback(updatedFeedback);
    try {
        localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
    } catch (error) {
        console.error("Could not save feedback to localStorage", error);
    }
  };
  
  const logout = () => {
    setUser(null);
    setIsAdmin(false); // Also clear admin status on logout
    localStorage.removeItem('userProfile');
    // We don't clear feedback so the admin can see it even after logging out/in.
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
