export interface Panel {
  id: string;
  name: string;
  description: string;
  requiresPanel3Credentials: boolean;
}

export interface PanelUser {
  id: string;
  username: string;
  email: string;
  panelId: string;
  isActive: boolean;
  // In a real app, password would be hashed and not stored directly here.
  // For simulation, we'll just store a placeholder.
  passwordPlaceholder: string; 
}

export interface Panel3Credential {
  id: string;
  email: string;
  // In a real app, API password would be hashed and not stored directly here.
  apiPasswordPlaceholder: string;
}

export type CampaignStatus = "Pending" | "Completed";
export type CampaignType = "Normal" | "Priority" | "Urgent";

export interface CampaignReport {
  id: string;
  campaignId: string; // Unique ID for the campaign
  campaignName: string;
  panelId: string;
  panelUserId: string;
  panel3CredentialId?: string; // Optional, only for Panel 2 campaigns
  panel3PasswordPlaceholder?: string; // Optional, only for Panel 2 campaigns
  status: CampaignStatus;
  campaignType: CampaignType; // New field for campaign type
  createdDate: string;
  updatedDate: string;
  createdByAdminId: string; // Placeholder for admin who created it
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Campaign Manager"; // Example roles
  isActive: boolean;
  passwordPlaceholder: string; // For simulation, would be hashed in real app
}

export interface AppContextType {
  panels: Panel[];
  panelUsers: PanelUser[];
  panel3Credentials: Panel3Credential[];
  campaignReports: CampaignReport[];
  employees: Employee[]; // New state for employees
  addPanel: (panel: Omit<Panel, "id">) => void;
  addPanelUser: (user: Omit<PanelUser, "id">) => void;
  addPanel3Credential: (credential: Omit<Panel3Credential, "id">) => void;
  addCampaignReport: (report: Omit<CampaignReport, "id" | "createdDate" | "updatedDate" | "createdByAdminId">) => void;
  updateCampaignStatus: (id: string, status: CampaignStatus) => void;
  addEmployee: (employee: Omit<Employee, "id">) => void; // New function to add employees
  updateEmployee: (employee: Employee) => void; // New function to update employees
}