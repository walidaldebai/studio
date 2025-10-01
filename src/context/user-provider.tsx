
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export interface UserProfile {
  name: string;
  gender: string;
  specialization: string;
  healthIssues?: string;
}

export interface Feedback {
  id: string; // Firestore uses string IDs
  name: string;
  feedback: string;
  createdAt: Date;
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

    // Set up Firestore listener for feedback
    const feedbackCollection = collection(db, 'feedback');
    const q = query(feedbackCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const feedbackData: Feedback[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        feedbackData.push({
          id: doc.id,
          name: data.name,
          feedback: data.feedback,
          createdAt: data.createdAt.toDate(),
        });
      });
      setFeedback(feedbackData);
    }, (error) => {
      console.error("Error fetching feedback: ", error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
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
    await addDoc(collection(db, "feedback"), {
      ...newFeedback,
      createdAt: new Date(),
    });
  };
  
  const logout = () => {
    setUser(null);
    setAdminStatus(false);
    localStorage.removeItem('userProfile');
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
