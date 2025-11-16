import { Session, User } from '@supabase/supabase-js'; // New import

export interface Panel {
  id: string;
  name: string;
  description: string;
  requires_panel3_credentials: boolean;
}

export interface PanelUser {
  id: string;
  username: string;
  email: string;
  panel_id: string;
  is_active: boolean;
  password_placeholder: string;
}

export interface Panel3Credential {
  id: string;
  email: string;
  api_password_placeholder: string;
}

export type CampaignStatus = "Pending" | "Completed";
export type CampaignType = "Normal" | "Priority" | "Urgent";

export interface CampaignReport {
  id: string;
  campaign_id: string;
  campaign_name: string;
  panel_id: string;
  panel_user_id: string;
  panel3_credential_id?: string;
  panel3_password_placeholder?: string;
  status: CampaignStatus;
  campaign_type: CampaignType;
  campaign_date: string;
  created_date: string;
  updated_date: string;
  created_by_admin_id: string; // Now stores the actual user ID
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Employee';
  is_active: boolean;
  created_at: string;
}

export interface SessionContextType {
  session: Session | null;
  user: User | null;
  employee: Employee | null;
  isAdmin: boolean;
  isEmployee: boolean;
  isLoadingSession: boolean;
}

export interface AppContextType {
  panels: Panel[];
  panelUsers: PanelUser[];
  panel3Credentials: Panel3Credential[];
  campaignReports: CampaignReport[];
  employees: Employee[]; // New
  isLoading: boolean;
  error: string | null;
  addPanel: (panel: Omit<Panel, "id">) => Promise<void>;
  updatePanel: (panel: Panel) => Promise<void>;
  deletePanel: (id: string) => Promise<void>;
  addPanelUser: (user: Omit<PanelUser, "id">) => Promise<void>;
  addPanel3Credential: (credential: Omit<Panel3Credential, "id">) => Promise<void>;
  addCampaignReport: (report: Omit<CampaignReport, "id" | "created_date" | "updated_date" | "created_by_admin_id">) => Promise<void>;
  updateCampaignStatus: (id: string, status: CampaignStatus) => Promise<void>;
  addEmployee: (employee: Omit<Employee, "id" | "created_at">) => Promise<void>; // New
  updateEmployee: (employee: Employee) => Promise<void>; // New
  deleteEmployee: (id: string) => Promise<void>; // New
}