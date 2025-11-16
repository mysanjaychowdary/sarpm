"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Panel, PanelUser, Panel3Credential, CampaignReport, AppContextType, CampaignStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [panels, setPanels] = useState<Panel[]>([
    { id: uuidv4(), name: "Panel 1", description: "Standard campaigns", requiresPanel3Credentials: false },
    { id: uuidv4(), name: "Panel 2", description: "Requires Panel 3 for execution", requiresPanel3Credentials: true },
    { id: uuidv4(), name: "Panel 3", description: "Credential source only", requiresPanel3Credentials: false },
  ]);

  const [panelUsers, setPanelUsers] = useState<PanelUser[]>([
    { id: uuidv4(), username: "user1_p1", email: "user1@panel1.com", panelId: panels[0].id, isActive: true, passwordPlaceholder: "password123" },
    { id: uuidv4(), username: "user2_p1", email: "user2@panel1.com", panelId: panels[0].id, isActive: true, passwordPlaceholder: "password123" },
    { id: uuidv4(), username: "user1_p2", email: "user1@panel2.com", panelId: panels[1].id, isActive: true, passwordPlaceholder: "password123" },
  ]);

  const [panel3Credentials, setPanel3Credentials] = useState<Panel3Credential[]>([
    { id: uuidv4(), email: "p3user1@panel3.com", apiPasswordPlaceholder: "p3pass1" },
    { id: uuidv4(), email: "p3user2@panel3.com", apiPasswordPlaceholder: "p3pass2" },
  ]);

  const [campaignReports, setCampaignReports] = useState<CampaignReport[]>([]);

  const addPanel = (panel: Omit<Panel, "id">) => {
    setPanels((prev) => [...prev, { ...panel, id: uuidv4() }]);
  };

  const addPanelUser = (user: Omit<PanelUser, "id">) => {
    setPanelUsers((prev) => [...prev, { ...user, id: uuidv4() }]);
  };

  const addPanel3Credential = (credential: Omit<Panel3Credential, "id">) => {
    setPanel3Credentials((prev) => [...prev, { ...credential, id: uuidv4() }]);
  };

  const addCampaignReport = (report: Omit<CampaignReport, "id" | "createdDate" | "updatedDate" | "createdByAdminId">) => {
    const now = new Date().toISOString();
    setCampaignReports((prev) => [
      ...prev,
      { ...report, id: uuidv4(), createdDate: now, updatedDate: now, createdByAdminId: "admin_user_id" }, // Placeholder admin ID
    ]);
  };

  const updateCampaignStatus = (id: string, status: CampaignStatus) => {
    setCampaignReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status, updatedDate: new Date().toISOString() } : report
      )
    );
  };

  const value = {
    panels,
    panelUsers,
    panel3Credentials,
    campaignReports,
    addPanel,
    addPanelUser,
    addPanel3Credential,
    addCampaignReport,
    updateCampaignStatus,
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