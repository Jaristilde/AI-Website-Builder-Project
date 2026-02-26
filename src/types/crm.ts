export interface GoogleConnection {
  connected: boolean;
  email?: string;
  sheetId?: string;
  sheetUrl?: string;
  appsScriptUrl?: string;          // Deployed Apps Script web app URL
  connectedAt?: string;
  businessName?: string;
}

export interface LeadEntry {
  date: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  service?: string;
}

export interface LeadStats {
  totalLeads: number;
  recentLeads: LeadEntry[];        // Last 5
  lastLeadDate?: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  lastVisit: string;
}

export type DashboardTab = 'overview' | 'leads' | 'appointments' | 'clients' | 'publish' | 'settings';
