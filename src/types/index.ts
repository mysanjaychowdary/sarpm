export interface Panel {
  id: string;
  name: string;
  description: string;
  requires_panel3_credentials: boolean; // Changed to snake_case
}

export interface PanelUser {
  id: string;
  username: string;
  email: string;
  panel_id: string; // Changed to snake_case
  is_active: boolean; // Changed to snake_case
  password_placeholder: string;
}

export interface Panel3Credential {
  id: string;
  email: string;
  api_password_placeholder: string; // Changed to snake_case
}

export type CampaignStatus = "Pending" | "Completed";
export type CampaignType = "Normal" | "Priority" | "Urgent";

export interface CampaignReport {
  id: string;
  campaign_id: string; // Changed to snake_case
  campaign_name: string; // Changed to snake_case
  panel_id: string; // Changed to snake_case
  panel_user_id: string; // Changed to snake_case
  panel3_credential_id?: string; // Changed to snake_case
  panel3_password_placeholder?: string; // Changed to snake_case
  status: CampaignStatus;
  campaign_type: CampaignType; // Changed to snake_case
  campaign_date: string; // Changed to snake_case
  created_date: string; // Changed to snake_case
  updated_date: string; // Changed to snake_case
  created_by_admin_id: string; // Changed to snake_case
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Campaign Manager";
  is_active: boolean; // Changed to snake_case
  password_placeholder: string;
}

export interface AppContextType {
  panels: Panel[];
  panelUsers: PanelUser[];
  panel3Credentials: Panel3Credential[];
  campaignReports: CampaignReport[];
  employees: Employee[];
  isLoading: boolean; // Added for loading state
  error: string | null; // Added for error state
  addPanel: (panel: Omit<Panel, "id">) => Promise<void>;
  updatePanel: (panel: Panel) => Promise<void>;
  deletePanel: (id: string) => Promise<void>;
  addPanelUser: (user: Omit<PanelUser, "id">) => Promise<void>;
  addPanel3Credential: (credential: Omit<Panel3Credential, "id">) => Promise<void>;
  addCampaignReport: (report: Omit<CampaignReport, "id" | "created_date" | "updated_date" | "created_by_admin_id">) => Promise<void>; // Updated field names
  updateCampaignStatus: (id: string, status: CampaignStatus) => Promise<void>;
  addEmployee: (employee: Omit<Employee, "id">) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
}