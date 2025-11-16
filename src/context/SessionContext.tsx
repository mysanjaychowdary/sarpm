"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } => "react-router-dom";
import { showError } from "@/utils/toast";

interface SessionContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("SessionContext: Setting up auth state change listener.");
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("SessionContext: Auth state changed - event:", event, "session:", currentSession);
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          if (currentSession && window.location.pathname === '/login') {
            console.log("SessionContext: Signed in/Initial session, redirecting to /dashboard.");
            navigate('/dashboard', { replace: true });
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          console.log("SessionContext: Signed out, redirecting to /login.");
          navigate('/login', { replace: true });
        }
        setIsLoading(false);
        console.log("SessionContext: isLoading set to false.");
      }
    );

    // Initial session check
    console.log("SessionContext: Performing initial session check.");
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("SessionContext: Initial session data:", initialSession);
      setSession(initialSession);
      setUser(initialSession?.user || null);
      setIsLoading(false);
      console.log("SessionContext: Initial check done, isLoading set to false.");
      if (!initialSession && window.location.pathname !== '/login') {
        console.log("SessionContext: No initial session, not on login page, redirecting to /login.");
        navigate('/login', { replace: true });
      } else if (initialSession && window.location.pathname === '/login') {
        console.log("SessionContext: Initial session found, on login page, redirecting to /dashboard.");
        navigate('/dashboard', { replace: true });
      }
    });

    return () => {
      console.log("SessionContext: Unsubscribing from auth listener.");
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <SessionContext.Provider value={{ session, user, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }
  return context;
};