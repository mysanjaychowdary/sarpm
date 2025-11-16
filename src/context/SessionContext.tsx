"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';
import { Employee } from '@/types';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  employee: Employee | null;
  isAdmin: boolean;
  isEmployee: boolean;
  isLoadingSession: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const fetchEmployeeProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error;
      }
      setEmployee(data || null);
    } catch (err: any) {
      console.error("Error fetching employee profile:", err.message);
      showError("Failed to load user profile: " + err.message);
      setEmployee(null);
    }
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change:", event, currentSession);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        if (currentSession?.user) {
          await fetchEmployeeProfile(currentSession.user.id);
        } else {
          setEmployee(null);
        }
        setIsLoadingSession(false);
      }
    );

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user || null);
      if (initialSession?.user) {
        fetchEmployeeProfile(initialSession.user.id);
      } else {
        setEmployee(null);
      }
      setIsLoadingSession(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchEmployeeProfile]);

  const isAdmin = employee?.role === 'Admin';
  const isEmployee = employee?.role === 'Employee'; // All authenticated users are employees by default

  const value = {
    session,
    user,
    employee,
    isAdmin,
    isEmployee,
    isLoadingSession,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};