import React, { useState } from 'react';
import { useGoogle } from '../../context/GoogleContext';
import { useBuilder } from '../../context/BuilderContext';
import { ConnectionStatus } from './ConnectionStatus';
import { AppsScriptSetup } from './AppsScriptSetup';
import { verifyConnection } from '../../lib/google';
import { 
  Settings, 
  Database, 
  User, 
  Palette, 
  Trash2, 
  RefreshCw, 
  Check, 
  X,
  Loader2,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export const SettingsPanel: React.FC = () => {
  const { connection, isConnected, disconnect, setConnection } = useGoogle();
  const { businessData, setBusinessData } = useBuilder();
  const [showSetup, setShowSetup] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<'success' | 'error' | null>(null);

  const handleTestConnection = async () => {
    if (!connection.appsScriptUrl) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const result = await verifyConnection(connection.appsScriptUrl);
      setVerifyResult(result.connected ? 'success' : 'error');
    } catch {
      setVerifyResult('error');
    } finally {
      setVerifying(false);
      setTimeout(() => setVerifyResult(null), 3000);
    }
  };

  const handleResetEverything = () => {
    if (window.confirm('Are you sure? This will clear all your website data and disconnect Google Sheets. This cannot be undone.')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-zinc-900">Settings</h2>
        <p className="text-zinc-500 font-medium">Manage your connection and business profile.</p>
      </div>

      {/* Google Sheets Connection */}
      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-50 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900">Google Sheets Connection</h3>
        </div>
        <div className="p-8 space-y-6">
          <ConnectionStatus />
          
          {isConnected ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Deployment URL</p>
                  <p className="text-sm font-mono text-zinc-600 truncate bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    {connection.appsScriptUrl}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Google Sheet</p>
                  <a 
                    href={connection.sheetUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-zinc-100 transition-colors"
                  >
                    <span className="text-sm font-bold text-zinc-700 truncate">{businessData?.name} Leads</span>
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button 
                  onClick={handleTestConnection}
                  disabled={verifying}
                  variant="ghost"
                  className="h-11 px-6 rounded-xl border border-zinc-100 bg-white"
                >
                  {verifying ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : verifyResult === 'success' ? (
                    <Check className="w-4 h-4 mr-2 text-emerald-500" />
                  ) : verifyResult === 'error' ? (
                    <X className="w-4 h-4 mr-2 text-red-500" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Test Connection
                </Button>
                <Button 
                  onClick={() => {
                    if (window.confirm('Disconnect Google Sheets? Your website will stop capturing leads until you reconnect.')) {
                      disconnect();
                    }
                  }}
                  variant="ghost"
                  className="h-11 px-6 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect Google
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <p className="text-sm text-zinc-500">Connect your Google account to start capturing leads from your website.</p>
              <Button 
                onClick={() => setShowSetup(true)}
                className="h-12 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
              >
                Set Up Google Sheets
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Business Info */}
      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-50 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900">Business Profile</h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Business Name</p>
                <p className="text-lg font-bold text-zinc-900">{businessData?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Owner</p>
                <p className="text-lg font-bold text-zinc-900">{businessData?.ownerName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Contact</p>
                <p className="text-sm text-zinc-600">{businessData?.email}</p>
                <p className="text-sm text-zinc-600">{businessData?.phone}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Location</p>
                <p className="text-lg font-bold text-zinc-900">{businessData?.city}, {businessData?.state}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tagline</p>
                <p className="text-sm text-zinc-600 italic">"{businessData?.tagline}"</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-50">
            <Link to="/builder">
              <Button variant="ghost" className="h-11 px-6 rounded-xl border border-zinc-100 bg-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Business Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Design Settings */}
      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-50 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Palette className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900">Design & Style</h3>
        </div>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl shadow-inner" 
              style={{ backgroundColor: businessData?.brandColor || '#9333ea' }} 
            />
            <div>
              <p className="font-bold text-zinc-900">Brand Color</p>
              <p className="text-xs text-zinc-400 font-mono uppercase">{businessData?.brandColor}</p>
            </div>
          </div>
          <Link to="/builder">
            <Button variant="ghost" className="h-11 px-6 rounded-xl border border-zinc-100 bg-white">
              Change Style
            </Button>
          </Link>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-[32px] border border-red-100 overflow-hidden">
        <div className="p-8 border-b border-red-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-900">Danger Zone</h3>
        </div>
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="font-bold text-red-900">Reset Everything</p>
            <p className="text-sm text-red-700 opacity-70">Delete all your data and start over from scratch.</p>
          </div>
          <Button 
            onClick={handleResetEverything}
            variant="ghost"
            className="h-12 px-8 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all"
          >
            Reset All Data
          </Button>
        </div>
      </div>

      {showSetup && <AppsScriptSetup onClose={() => setShowSetup(false)} />}
    </div>
  );
};
