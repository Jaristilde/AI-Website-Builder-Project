import React from 'react';
import { useGoogle } from '../../context/GoogleContext';
import { ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

export const ConnectionStatus: React.FC = () => {
  const { connection, isConnected } = useGoogle();

  if (isConnected) {
    return (
      <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <div>
            <p className="text-sm font-bold text-emerald-900">Google Sheets Connected</p>
            {connection.email && (
              <p className="text-xs text-emerald-700 opacity-80">{connection.email}</p>
            )}
          </div>
        </div>
        {connection.sheetUrl && (
          <a 
            href={connection.sheetUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
          >
            Open Sheet <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
        <div>
          <p className="text-sm font-bold text-amber-900">Google Not Connected</p>
          <p className="text-xs text-amber-700 opacity-80">Leads are not being saved</p>
        </div>
      </div>
      <AlertCircle className="w-5 h-5 text-amber-500" />
    </div>
  );
};
