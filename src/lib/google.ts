import { LeadEntry, LeadStats } from '../types/crm';

/**
 * Submit a lead to the Apps Script web app
 */
export async function submitLead(
  appsScriptUrl: string,
  lead: Omit<LeadEntry, 'date'>
): Promise<{ success: boolean; message: string }> {
  try {
    // We use no-cors because Apps Script redirects (302) to a different domain
    // and browsers block the redirect in a standard CORS fetch.
    // POST with no-cors works but we can't read the response.
    await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // Use text/plain to avoid preflight
      body: JSON.stringify(lead),
      mode: 'no-cors',
    });
    
    return { success: true, message: 'Lead submitted successfully' };
  } catch (error) {
    console.error('Lead submission error:', error);
    return { success: false, message: 'Failed to submit lead. Please try again.' };
  }
}

/**
 * Fetch lead stats from Apps Script
 */
export async function fetchLeadStats(appsScriptUrl: string): Promise<LeadStats | null> {
  try {
    const response = await fetch(`${appsScriptUrl}?action=recent`, {
      method: 'GET',
    });
    
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data = await response.json();
    return {
      totalLeads: data.totalLeads || 0,
      recentLeads: data.recentLeads || [],
      lastLeadDate: data.lastLeadDate || undefined,
    };
  } catch (error) {
    console.error('Failed to fetch lead stats:', error);
    return null;
  }
}

/**
 * Verify Apps Script connection
 */
export async function verifyConnection(appsScriptUrl: string): Promise<{
  connected: boolean;
  sheetUrl?: string;
  sheetId?: string;
}> {
  try {
    const response = await fetch(`${appsScriptUrl}?action=info`, {
      method: 'GET',
    });
    
    if (!response.ok) throw new Error('Connection failed');
    
    const data = await response.json();
    return {
      connected: true,
      sheetUrl: data.sheetUrl,
      sheetId: data.sheetId,
    };
  } catch {
    return { connected: false };
  }
}
