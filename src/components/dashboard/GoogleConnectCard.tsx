import React from 'react';
import { Database, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface GoogleConnectCardProps {
  onConnect: () => void;
}

export const GoogleConnectCard: React.FC<GoogleConnectCardProps> = ({ onConnect }) => {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm text-center space-y-6">
      <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto">
        <Database className="w-10 h-10 text-purple-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-zinc-900">Connect Google to Activate Your CRM</h3>
        <p className="text-zinc-500 max-w-md mx-auto">
          Your website contact form will automatically save leads to a Google Sheet you own. 
          Free. Secure. Your data.
        </p>
      </div>

      <Button 
        onClick={onConnect}
        className="h-12 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
      >
        Set Up Google Sheets <ArrowRight className="ml-2 w-4 h-4" />
      </Button>

      <div className="flex items-center justify-center gap-6 pt-4 border-t border-zinc-50">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          100% Free
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          No Server Needed
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          You Own Your Data
        </div>
      </div>
    </div>
  );
};
