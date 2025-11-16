"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Panel, PanelUser, Panel3Credential, CampaignReport, AppContextType, CampaignStatus, TeamMember } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from "./SessionContext"; // Import useSession

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: isSessionLoading } = useSession(); // Get user from session
  const [panels, setPanels] = useState<Panel[]>([]);
  const [panelUsers, setPanelUsers] = useState<PanelUser[]>([]);
  const [panel3Credentials, setPanel3Credentials] = useState<Panel3Credential[]>([]);
  const [campaignReports, setCampaignReports] = useState<CampaignReport[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]); // New: Team members state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    console.log("AppContext: fetchData called.");

    setIsLoading(true);
    setError(null);
    try {
      console.log("AppContext: Fetching panels...");
      const { data: panelsData, error: panelsError } = await supabase.from('panels').select('*');
      if (panelsError) throw panelsError;
      setPanels(panelsData || []);
      console.log("AppContext: Panels fetched:", panelsData?.length);

      console.log("AppContext: Fetching panel_users...");
      const { data: panelUsersData, error: panelUsersError } = await supabase.from('panel_users').select('*');
      if (panelUsersError) throw panelUsersError;
      setPanelUsers(panelUsersData || []);
      console.log("AppContext: Panel users fetched:", panelUsersData?.length);

      console.log("AppContext: Fetching panel3_credentials...");
      const { data: panel3CredentialsData, error: panel3CredentialsError } = await supabase.from('panel3_credentials').select('*');
      if (panel3CredentialsError) throw panel3CredentialsError;
      setPanel3Credentials(panel3CredentialsData || []);
      console.log("AppContext: Panel 3 credentials fetched:", panel3CredentialsData?.length);

      console.log("AppContext: Fetching campaign_reports...");
      const { data: campaignReportsData, error: campaignReportsError } = await supabase.from('campaign_reports').select('*').order('created_date', { ascending: false });
      if (campaignReportsError) throw campaignReportsError;
      setCampaignReports(campaignReportsData || []);
      console.log("AppContext: Campaign reports fetched:", campaignReportsData?.length);

      console.log("AppContext: Fetching team_members..."); // New: Fetch team members
      const { data: teamMembersData, error: teamMembersError } = await supabase.from('team_members').select('*');
      if (teamMembersError) throw teamMembersError;
      setTeamMembers(teamMembersData || []);
      console.log("AppContext: Team members fetched:", teamMembersData?.length);

    } catch (err: any) {
      console.error("AppContext: Error fetching data:", err.message);
      showError("Failed to load data: " + err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
      console.log("AppContext: Data fetching complete, isLoading set to false.");
    }
  }, []);

  useEffect(() => {
    if (!isSessionLoading) { // Only fetch data once session loading is complete
      fetchData();
    }
  }, [fetchData, isSessionLoading]);

  const addPanel = async (panel: Omit<Panel, "id">) => {
    console.log("AppContext: Adding panel:", panel.name);
    const { data, error } = await supabase.from('panels').insert(panel).select();
    if (error) {
      showError("Failed to add panel: " + error.message);
      throw error;
    }
    setPanels((prev) => [...prev, data[0]]);
    showSuccess("Panel added successfully!");
  };

  const updatePanel = async (updatedPanel: Panel) => {
    console.log("AppContext: Updating panel:", updatedPanel.name);
    const { data, error } = await supabase.from('panels').update(updatedPanel).eq('id', updatedPanel.id).select();
    if (error) {
      showError("Failed to update panel: " + error.message);
      throw error;
    }
    setPanels((prev) =>
      prev.map((panel) => (panel.id === updatedPanel.id ? data[0] : panel))
    );
    showSuccess("Panel updated successfully!");
  };

  const deletePanel = async (id: string) => {
    console.log("AppContext: Deleting panel with ID:", id);
    const { error } = await supabase.from('panels').delete().eq('id', id);
    if (error) {
      showError("Failed to delete panel: " + error.message);
      throw error;
    }
    setPanels((prev) => prev.filter((panel) => panel.id !== id));
    setPanelUsers((prev) => prev.filter((user) => user.panel_id !== id));
    setCampaignReports((prev) => prev.filter((report) => report.panel_id !== id));
    showSuccess("Panel deleted successfully!");
  };

  const addPanelUser = async (user: Omit<PanelUser, "id">) => {
    console.log("AppContext: Adding panel user:", user.username);
    const { data, error } = await supabase.from('panel_users').insert(user).select();
    if (error) {
      showError("Failed to add panel user: " + error.message);
      throw error;
    }
    setPanelUsers((prev) => [...prev, data[0]]);
    showSuccess("Panel user added successfully!");
  };

  const addPanel3Credential = async (credential: Omit<Panel3Credential, "id">) => {
    console.log("AppContext: Adding Panel 3 credential for email:", credential.email);
    const { data, error } = await supabase.from('panel3_credentials').insert(credential).select();
    if (error) {
      showError("Failed to add Panel 3 credential: " + error.message);
      throw error;
    }
    setPanel3Credentials((prev) => [...prev, data[0]]);
    showSuccess("Panel 3 credential added successfully!");
  };

  const addCampaignReport = async (report: Omit<CampaignReport, "id" | "created_date" | "updated_date" | "created_by_admin_id">) => {
    console.log("AppContext: Adding campaign report:", report.campaign_name);
    const now = new Date().toISOString();
    const newReport = { ...report, created_date: now, updated_date: now, created_by_admin_id: user?.id || "anonymous" }; // Use auth.uid()
    const { data, error } = await supabase.from('campaign_reports').insert(newReport).select();
    if (error) {
      showError("Failed to create campaign report: " + error.message);
      throw error;
    }
    setCampaignReports((prev) => [data[0], ...prev]);
    showSuccess("Campaign report created successfully!");
  };

  const updateCampaignStatus = async (id: string, status: CampaignStatus) => {
    console.log(`AppContext: Updating campaign ${id} status to ${status}`);
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
    showSuccess("Campaign status updated successfully!");
  };

  // New: Team Member CRUD operations
  const addTeamMember = async (member: Omit<TeamMember, "id" | "created_at">) => {
    console.log("AppContext: Adding team member:", member.name);
    // For adding a team member, we'd typically create an auth user first,
    // and the trigger would create the team_members entry.
    // For now, we'll simulate by directly inserting, assuming the auth.user already exists or will be created separately.
    // In a real scenario, you'd use supabase.auth.admin.createUser() on the server-side.
    const { data, error } = await supabase.from('team_members').insert(member).select();
    if (error) {
      showError("Failed to add team member: " + error.message);
      throw error;
    }
    setTeamMembers((prev) => [...prev, data[0]]);
    showSuccess("Team member added successfully!");
  };

  const updateTeamMember = async (updatedMember: TeamMember) => {
    console.log("AppContext: Updating team member:", updatedMember.name);
    const { data, error } = await supabase.from('team_members').update(updatedMember).eq('id', updatedMember.id).select();
    if (error) {
      showError("Failed to update team member: " + error.message);
      throw error;
    }
    setTeamMembers((prev) =>
      prev.map((member) => (member.id === updatedMember.id ? data[0] : member))
    );
    showSuccess("Team member updated successfully!");
  };

  const deleteTeamMember = async (id: string) => {
    console.log("AppContext: Deleting team member with ID:", id);
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) {
      showError("Failed to delete team member: " + error.message);
      throw error;
    }
    setTeamMembers((prev) => prev.filter((member) => member.id !== id));
    showSuccess("Team member deleted successfully!");
  };

  const value = {
    panels,
    panelUsers,
    panel3Credentials,
    campaignReports,
    teamMembers, // New: teamMembers in context value
    addPanel,
    updatePanel,
    deletePanel,
    addPanelUser,
    addPanel3Credential,
    addCampaignReport,
    updateCampaignStatus,
    addTeamMember, // New: addTeamMember function
    updateTeamMember, // New: updateTeamMember function
    deleteTeamMember, // New: deleteTeamMember function
    isLoading: isLoading || isSessionLoading, // Combine loading states
    error,
    fetchData, // Expose fetchData
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