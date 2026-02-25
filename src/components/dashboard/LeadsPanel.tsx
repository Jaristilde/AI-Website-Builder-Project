import React, { useState, useEffect } from 'react';
import { useGoogle } from '../../context/GoogleContext';
import { fetchLeadStats } from '../../lib/google';
import { LeadStats } from '../../types/crm';
import { GoogleConnectCard } from './GoogleConnectCard';
import { AppsScriptSetup } from './AppsScriptSetup';
import { 
  Users, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '../ui/button';

export const LeadsPanel: React.FC = () => {
  const { isConnected, connection } = useGoogle();
  const [showSetup, setShowSetup] = useState(false);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedLead, setExpandedLead] = useState<number | null>(null);

  const loadLeads = async () => {
    if (!isConnected || !connection.appsScriptUrl) return;
    setLoading(true);
    const data = await fetchLeadStats(connection.appsScriptUrl);
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLeads();
  }, [isConnected, connection.appsScriptUrl]);

  if (!isConnected) {
    return (
      <div className="space-y-8">
        <GoogleConnectCard onConnect={() => setShowSetup(true)} />
        {showSetup && <AppsScriptSetup onClose={() => setShowSetup(false)} />}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-zinc-900">Your Leads</h2>
          <p className="text-zinc-500 font-medium">
            All leads are stored in your Google Sheet. Here are the most recent.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={loadLeads}
            disabled={loading}
            className="h-10 px-4 rounded-xl border border-zinc-100 bg-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <a 
            href={connection.sheetUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="h-10 px-4 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            View All in Sheets <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <p className="text-2xl font-black text-zinc-900">{stats?.totalLeads || 0}</p>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider text-left">Total Leads Captured</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-32 w-full bg-white border border-zinc-100 rounded-3xl animate-pulse" />
          ))
        ) : stats?.recentLeads && stats.recentLeads.length > 0 ? (
          stats.recentLeads.map((lead, i) => (
            <div key={i} className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden transition-all hover:border-purple-200">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 font-bold text-lg flex-shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-zinc-900 text-lg">{lead.name}</h4>
                        {lead.service && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full uppercase tracking-wider">
                            {lead.service}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-purple-600 transition-colors">
                          <Mail className="w-4 h-4" /> {lead.email}
                        </a>
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-purple-600 transition-colors">
                            <Phone className="w-4 h-4" /> {lead.phone}
                          </a>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" /> {new Date(lead.date).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setExpandedLead(expandedLead === i ? null : i)}
                    className="flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors self-end md:self-start"
                  >
                    {expandedLead === i ? (
                      <>Hide Message <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>View Message <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                </div>

                {expandedLead === i && lead.message && (
                  <div className="mt-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2 text-zinc-400 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Message</span>
                    </div>
                    <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
                      {lead.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-16 rounded-[40px] border border-zinc-100 shadow-sm text-center space-y-6">
            <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto">
              <Users className="w-10 h-10 text-zinc-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-zinc-900">No leads yet!</h3>
              <p className="text-zinc-500 max-w-sm mx-auto">
                Make sure to share your website link with potential customers to start capturing leads.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
