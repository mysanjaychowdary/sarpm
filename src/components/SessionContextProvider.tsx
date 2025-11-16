import React, { useState, useEffect, createContext, useContext } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { MadeWithDyad } from './made-with-dyad';

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  supabase: SupabaseClient;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Loading application...</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Please wait</p>
        </div>
        <MadeWithDyad />
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ session, isLoading, supabase }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};