
'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

interface TransitionContextType {
  transitionTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // This will run when the new page component has mounted
    // and will fade the overlay out.
    setIsExiting(false);
  }, []); // The key here is an empty dependency array to run only on mount.


  const transitionTo = useCallback((href: string) => {
    setIsExiting(true);
    setTimeout(() => {
      router.push(href);
    }, 500); // This should match the fade-out animation duration
  }, [router]);

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      {isExiting && (
        <div className="fixed inset-0 bg-black z-[100] fade-in" />
      )}
      <div className={!isExiting ? 'fade-in' : ''}>
        {children}
      </div>
    </TransitionContext.Provider>
  );
}

export function useTransitionRouter() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransitionRouter must be used within a TransitionProvider');
  }
  return context;
}
