"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Panel, PanelUser, Panel3Credential, CampaignReport, AppContextType, CampaignStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from "./SessionContext"; // New import

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoadingSession } = useSession(); // Use session context
  const [panels, setPanels] = useState<Panel[]>([]);
  const [panelUsers, setPanelUsers] = useState<PanelUser[]>([]);
  const [panel3Credentials, setPanel3Credentials] = useState<Panel3Credential[]>([]);
  const [campaignReports, setCampaignReports] = useState<CampaignReport[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]); // New state for employees
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    console.log("AppContext: fetchData called.");

    if (isLoadingSession) {
      return; // Wait for session to load
    }

    setIsLoading(true);
    setError(null);
    try {
      // Fetch panels
      const { data: panelsData, error: panelsError } = await supabase.from('panels').select('*');
      if (panelsError) throw panelsError;
      setPanels(panelsData || []);

      // Fetch panel_users
      const { data: panelUsersData, error: panelUsersError } = await supabase.from('panel_users').select('*');
      if (panelUsersError) throw panelUsersError;
      setPanelUsers(panelUsersData || []);

      // Fetch panel3_credentials
      const { data: panel3CredentialsData, error: panel3CredentialsError } = await supabase.from('panel3_credentials').select('*');
      if (panel3CredentialsError) throw panel3CredentialsError;
      setPanel3Credentials(panel3CredentialsData || []);

      // Fetch campaign_reports
      const { data: campaignReportsData, error: campaignReportsError } = await supabase.from('campaign_reports').select('*').order('created_date', { ascending: false });
      if (campaignReportsError) throw campaignReportsError;
      setCampaignReports(campaignReportsData || []);

      // Fetch employees (only if user is authenticated)
      if (user) {
        const { data: employeesData, error: employeesError } = await supabase.from('employees').select('*');
        if (employeesError) throw employeesError;
        setEmployees(employeesData || []);
      }

    } catch (err: any) {
      console.error("AppContext: Error fetching data:", err.message);
      showError("Failed to load data: " + err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoadingSession]); // Depend on user and isLoadingSession

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CRUD operations for Panels
  const addPanel = async (panel: Omit<Panel, "id">) => {
    if (!user) { showError("You must be logged in to add a panel."); return; }
    const { data, error } = await supabase.from('panels').insert(panel).select();
    if (error) { showError("Failed to add panel: " + error.message); throw error; }
    setPanels((prev) => [...prev, data[0]]);
    showSuccess("Panel added successfully!");
  };

  const updatePanel = async (updatedPanel: Panel) => {
    if (!user) { showError("You must be logged in to update a panel."); return; }
    const { data, error } = await supabase.from('panels').update(updatedPanel).eq('id', updatedPanel.id).select();
    if (error) { showError("Failed to update panel: " + error.message); throw error; }
    setPanels((prev) => prev.map((panel) => (panel.id === updatedPanel.id ? data[0] : panel)));
    showSuccess("Panel updated successfully!");
  };

  const deletePanel = async (id: string) => {
    if (!user) { showError("You must be logged in to delete a panel."); return; }
    const { error } = await supabase.from('panels').delete().eq('id', id);
    if (error) { showError("Failed to delete panel: " + error.message); throw error; }
    setPanels((prev) => prev.filter((panel) => panel.id !== id));
    setPanelUsers((prev) => prev.filter((user) => user.panel_id !== id));
    setCampaignReports((prev) => prev.filter((report) => report.panel_id !== id));
    showSuccess("Panel deleted successfully!");
  };

  // CRUD operations for Panel Users
  const addPanelUser = async (panelUser: Omit<PanelUser, "id">) => {
    if (!user) { showError("You must be logged in to add a panel user."); return; }
    const { data, error } = await supabase.from('panel_users').insert(panelUser).select();
    if (error) { showError("Failed to add panel user: " + error.message); throw error; }
    setPanelUsers((prev) => [...prev, data[0]]);
    showSuccess("Panel user added successfully!");
  };

  // CRUD operations for Panel 3 Credentials
  const addPanel3Credential = async (credential: Omit<Panel3Credential, "id">) => {
    if (!user) { showError("You must be logged in to add Panel 3 credentials."); return; }
    const { data, error } = await supabase.from('panel3_credentials').insert(credential).select();
    if (error) { showError("Failed to add Panel 3 credential: " + error.message); throw error; }
    setPanel3Credentials((prev) => [...prev, data[0]]);
    showSuccess("Panel 3 credential added successfully!");
  };

  // CRUD operations for Campaign Reports
  const addCampaignReport = async (report: Omit<CampaignReport, "id" | "created_date" | "updated_date" | "created_by_admin_id">) => {
    if (!user) { showError("You must be logged in to create a campaign report."); return; }
    const now = new Date().toISOString();
    const newReport = { ...report, created_date: now, updated_date: now, created_by_admin_id: user.id };
    const { data, error } = await supabase.from('campaign_reports').insert(newReport).select();
    if (error) { showError("Failed to create campaign report: " + error.message); throw error; }
    setCampaignReports((prev) => [data[0], ...prev]);
    showSuccess("Campaign report created successfully!");
  };

  const updateCampaignStatus = async (id: string, status: CampaignStatus) => {
    if (!user) { showError("You must be logged in to update campaign status."); return; }
    const { data, error } = await supabase.from('campaign_reports').update({ status, updated_date: new Date().toISOString() }).eq('id', id).select();
    if (error) { showError("Failed to update campaign status: " + error.message); throw error; }
    setCampaignReports((prev) => prev.map((report) => report.id === id ? data[0] : report));
    showSuccess("Campaign status updated successfully!");
  };

  // CRUD operations for Employees
  const addEmployee = async (employee: Omit<Employee, "id" | "created_at">) => {
    if (!user) { showError("You must be logged in to add an employee."); return; }
    const { data, error } = await supabase.from('employees').insert(employee).select();
    if (error) { showError("Failed to add employee: " + error.message); throw error; }
    setEmployees((prev) => [...prev, data[0]]);
    showSuccess("Employee added successfully!");
  };

  const updateEmployee = async (updatedEmployee: Employee) => {
    if (!user) { showError("You must be logged in to update an employee."); return; }
    const { data, error } = await supabase.from('employees').update(updatedEmployee).eq('id', updatedEmployee.id).select();
    if (error) { showError("Failed to update employee: " + error.message); throw error; }
    setEmployees((prev) => prev.map((emp) => (emp.id === updatedEmployee.id ? data[0] : emp)));
    showSuccess("Employee updated successfully!");
  };

  const deleteEmployee = async (id: string) => {
    if (!user) { showError("You must be logged in to delete an employee."); return; }
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) { showError("Failed to delete employee: " + error.message); throw error; }
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    showSuccess("Employee deleted successfully!");
  };

  const value = {
    panels,
    panelUsers,
    panel3Credentials,
    campaignReports,
    employees, // Include employees in context value
    addPanel,
    updatePanel,
    deletePanel,
    addPanelUser,
    addPanel3Credential,
    addCampaignReport,
    updateCampaignStatus,
    addEmployee, // Include employee functions
    updateEmployee,
    deleteEmployee,
    isLoading,
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