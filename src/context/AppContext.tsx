"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Panel, PanelUser, Panel3Credential, CampaignReport, AppContextType, CampaignStatus, Employee } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from "./SessionContext"; // Import useSession

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: isAuthLoading } = useSession(); // Get user from session
  const [panels, setPanels] = useState<Panel[]>([]);
  const [panelUsers, setPanelUsers] = useState<PanelUser[]>([]);
  const [panel3Credentials, setPanel3Credentials] = useState<Panel3Credential[]>([]);
  const [campaignReports, setCampaignReports] = useState<CampaignReport[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { data: panelsData, error: panelsError } = await supabase.from('panels').select('*');
      if (panelsError) throw panelsError;
      setPanels(panelsData || []);

      const { data: panelUsersData, error: panelUsersError } = await supabase.from('panel_users').select('*');
      if (panelUsersError) throw panelUsersError;
      setPanelUsers(panelUsersData || []);

      const { data: panel3CredentialsData, error: panel3CredentialsError } = await supabase.from('panel3_credentials').select('*');
      if (panel3CredentialsError) throw panel3CredentialsError;
      setPanel3Credentials(panel3CredentialsData || []);

      const { data: campaignReportsData, error: campaignReportsError } = await supabase.from('campaign_reports').select('*').order('created_date', { ascending: false });
      if (campaignReportsError) throw campaignReportsError;
      setCampaignReports(campaignReportsData || []);

      const { data: employeesData, error: employeesError } = await supabase.from('employees').select('*');
      if (employeesError) throw employeesError;
      setEmployees(employeesData || []);

    } catch (err: any) {
      console.error("Error fetching data:", err.message);
      showError("Failed to load data: " + err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Re-fetch data when user changes

  useEffect(() => {
    if (!isAuthLoading) {
      fetchData();
    }
  }, [fetchData, isAuthLoading]);

  const addPanel = async (panel: Omit<Panel, "id">) => {
    const { data, error } = await supabase.from('panels').insert(panel).select();
    if (error) {
      showError("Failed to add panel: " + error.message);
      throw error;
    }
    setPanels((prev) => [...prev, data[0]]);
  };

  const updatePanel = async (updatedPanel: Panel) => {
    const { data, error } = await supabase.from('panels').update(updatedPanel).eq('id', updatedPanel.id).select();
    if (error) {
      showError("Failed to update panel: " + error.message);
      throw error;
    }
    setPanels((prev) =>
      prev.map((panel) => (panel.id === updatedPanel.id ? data[0] : panel))
    );
  };

  const deletePanel = async (id: string) => {
    const { error } = await supabase.from('panels').delete().eq('id', id);
    if (error) {
      showError("Failed to delete panel: " + error.message);
      throw error;
    }
    setPanels((prev) => prev.filter((panel) => panel.id !== id));
    setPanelUsers((prev) => prev.filter((user) => user.panel_id !== id)); // Cascade delete in UI
    setCampaignReports((prev) => prev.filter((report) => report.panel_id !== id)); // Cascade delete in UI
  };

  const addPanelUser = async (user: Omit<PanelUser, "id">) => {
    const { data, error } = await supabase.from('panel_users').insert(user).select();
    if (error) {
      showError("Failed to add panel user: " + error.message);
      throw error;
    }
    setPanelUsers((prev) => [...prev, data[0]]);
  };

  const addPanel3Credential = async (credential: Omit<Panel3Credential, "id">) => {
    const { data, error } = await supabase.from('panel3_credentials').insert(credential).select();
    if (error) {
      showError("Failed to add Panel 3 credential: " + error.message);
      throw error;
    }
    setPanel3Credentials((prev) => [...prev, data[0]]);
  };

  const addCampaignReport = async (report: Omit<CampaignReport, "id" | "created_date" | "updated_date" | "created_by_admin_id">) => {
    if (!user) {
      showError("You must be logged in to create a campaign report.");
      return;
    }
    const now = new Date().toISOString();
    const newReport = { ...report, created_date: now, updated_date: now, created_by_admin_id: user.id }; // Use actual admin ID
    const { data, error } = await supabase.from('campaign_reports').insert(newReport).select();
    if (error) {
      showError("Failed to create campaign report: " + error.message);
      throw error;
    }
    setCampaignReports((prev) => [data[0], ...prev]); // Add new reports to the top
  };

  const updateCampaignStatus = async (id: string, status: CampaignStatus) => {
    const { data, error } = await supabase.from('campaign_reports').update({ status, updated_date: new Date().toISOString() }).eq('id', id).select();
    if (error) {
      showError("Failed to update campaign status: " + error.message);
      throw error;
    }
    setCampaignReports((prev) =>
      prev.map((report) =>
        report.id === id ? data[0] : report
      )
    );
  };

  const addEmployee = async (employee: Omit<Employee, "id">) => {
    const { data, error } = await supabase.from('employees').insert(employee).select();
    if (error) {
      showError("Failed to add employee: " + error.message);
      throw error;
    }
    setEmployees((prev) => [...prev, data[0]]);
  };

  const updateEmployee = async (updatedEmployee: Employee) => {
    const { data, error } = await supabase.from('employees').update(updatedEmployee).eq('id', updatedEmployee.id).select();
    if (error) {
      showError("Failed to update employee: " + error.message);
      throw error;
    }
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === updatedEmployee.id ? data[0] : employee
      )
    );
  };

  const value = {
    panels,
    panelUsers,
    panel3Credentials,
    campaignReports,
    employees,
    addPanel,
    updatePanel,
    deletePanel,
    addPanelUser,
    addPanel3Credential,
    addCampaignReport,
    updateCampaignStatus,
    addEmployee,
    updateEmployee,
    isLoading: isLoading || isAuthLoading, // Combine loading states
    error,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};