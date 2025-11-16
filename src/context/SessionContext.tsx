"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Employee } from "@/types";

interface SessionContextType {
  session: Session | null;
  user: (User & { role?: Employee['role'] }) | null;
  isLoadingSession: boolean;
  isAdmin: boolean;
  isCampaignManager: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<(User & { role?: Employee['role'] }) | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const fetchUserRole = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('employees')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error.message);
      showError("Failed to fetch user role: " + error.message);
      return null;
    }
    return data?.role;
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      setSession(currentSession);
      if (currentSession) {
        const profile = currentSession.user;
        if (profile) {
          const role = await fetchUserRole(profile.id);
          setUser({ ...profile, role });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoadingSession(false);
    });

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession);
      setSession(initialSession);
      if (initialSession) {
        const profile = initialSession.user;
        if (profile) {
          const role = await fetchUserRole(profile.id);
          setUser({ ...profile, role });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoadingSession(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  const isAdmin = user?.role === "Admin";
  const isCampaignManager = user?.role === "Campaign Manager";

  const value = {
    session,
    user,
    isLoadingSession,
    isAdmin,
    isCampaignManager,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }
  return context;
};