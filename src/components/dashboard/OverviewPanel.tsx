import React, { useState, useEffect } from 'react';
import { useGoogle } from '../../context/GoogleContext';
import { useBuilder } from '../../context/BuilderContext';
import { fetchLeadStats } from '../../lib/google';
import { LeadStats } from '../../types/crm';
import { GoogleConnectCard } from './GoogleConnectCard';
import { AppsScriptSetup } from './AppsScriptSetup';
import { 
  Users, 
  Clock, 
  Briefcase, 
  RefreshCw, 
  ExternalLink, 
  Edit3, 
  Globe,
  ChevronRight,
  Mail
} from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const OverviewPanel: React.FC = () => {
  const { isConnected, connection, appointments, clients } = useGoogle();
  const { businessData } = useBuilder();
  const [showSetup, setShowSetup] = useState(false);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    if (!isConnected || !connection.appsScriptUrl) return;
    setLoading(true);
    const data = await fetchLeadStats(connection.appsScriptUrl);
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, [isConnected, connection.appsScriptUrl]);

  if (!isConnected) {
    return (
      <div className="space-y-12">
        <GoogleConnectCard onConnect={() => setShowSetup(true)} />
        
        {/* Placeholder Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-40 grayscale pointer-events-none">
          {[
            { label: 'Total Leads', icon: Users, value: '0' },
            { label: 'Appointments', icon: Clock, value: appointments.length || '0' },
            { label: 'Clients', icon: Users, value: clients.length || '0' },
            { label: 'Services', icon: Briefcase, value: businessData?.services.length || '0' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-4">
              <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-zinc-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {showSetup && <AppsScriptSetup onClose={() => setShowSetup(false)} />}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-4 relative overflow-hidden group">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Leads</p>
            {loading ? (
              <div className="h-9 w-16 bg-zinc-100 animate-pulse rounded-lg mt-1" />
            ) : (
              <p className="text-3xl font-black text-zinc-900">{stats?.totalLeads || 0}</p>
            )}
          </div>
          <button 
            onClick={loadStats}
            className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-purple-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Appointments</p>
            <p className="text-3xl font-black text-zinc-900">{appointments.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Clients</p>
            <p className="text-3xl font-black text-zinc-900">{clients.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Services</p>
            <p className="text-3xl font-black text-zinc-900">{businessData?.services.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a 
          href={connection.sheetUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-4 bg-white border border-zinc-100 rounded-2xl flex flex-col items-center gap-2 hover:bg-zinc-50 transition-colors text-center"
        >
          <ExternalLink className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold text-zinc-700">Open Sheet</span>
        </a>
        <Link 
          to="/builder"
          className="p-4 bg-white border border-zinc-100 rounded-2xl flex flex-col items-center gap-2 hover:bg-zinc-50 transition-colors text-center"
        >
          <Edit3 className="w-5 h-5 text-purple-600" />
          <span className="text-xs font-bold text-zinc-700">Edit Website</span>
        </Link>
        <Link 
          to="/preview"
          className="p-4 bg-white border border-zinc-100 rounded-2xl flex flex-col items-center gap-2 hover:bg-zinc-50 transition-colors text-center"
        >
          <Globe className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-bold text-zinc-700">View Website</span>
        </Link>
        <button 
          onClick={() => {
            const url = window.location.origin + '/preview';
            navigator.clipboard.writeText(url);
            alert('Website link copied to clipboard!');
          }}
          className="p-4 bg-white border border-zinc-100 rounded-2xl flex flex-col items-center gap-2 hover:bg-zinc-50 transition-colors text-center"
        >
          <RefreshCw className="w-5 h-5 text-amber-600" />
          <span className="text-xs font-bold text-zinc-700">Share Link</span>
        </button>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-zinc-900">Recent Leads</h3>
          <a 
            href={connection.sheetUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-bold text-purple-600 hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="divide-y divide-zinc-50">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-6 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-zinc-100 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-zinc-100 rounded" />
                  <div className="h-3 w-48 bg-zinc-100 rounded" />
                </div>
              </div>
            ))
          ) : stats?.recentLeads && stats.recentLeads.length > 0 ? (
            stats.recentLeads.map((lead, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{lead.name}</p>
                    <p className="text-sm text-zinc-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {lead.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    {new Date(lead.date).toLocaleDateString()}
                  </p>
                  {lead.service && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                      {lead.service}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-zinc-200" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-zinc-900">No leads yet</p>
                <p className="text-sm text-zinc-500">Share your website to start capturing leads!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
