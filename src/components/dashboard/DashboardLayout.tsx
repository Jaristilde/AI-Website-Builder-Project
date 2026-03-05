import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTab } from '../../types/crm';
import { useBuilder } from '../../context/BuilderContext';
import { useGoogle } from '../../context/GoogleContext';
import { ConnectionStatus } from './ConnectionStatus';
import { Globe, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';

const VALID_TABS: DashboardTab[] = ['overview', 'leads', 'appointments', 'clients', 'publish', 'settings'];

interface DashboardLayoutProps {
  children: (activeTab: DashboardTab, onTabChange: (tab: DashboardTab) => void) => React.ReactNode;
  onBack?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onBack }) => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') as DashboardTab | null;
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    initialTab && VALID_TABS.includes(initialTab) ? initialTab : 'overview'
  );
  const { businessData } = useBuilder();

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 pb-24 md:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-zinc-100 px-8 py-6 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="gap-2 text-zinc-500 hover:text-zinc-900"
                >
                  <ArrowLeft className="w-4 h-4" /> My Websites
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-black text-zinc-900">
                  Welcome, {businessData?.name || 'Business Owner'}!
                </h1>
                <p className="text-sm text-zinc-500 font-medium">Here's what's happening with your website.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ConnectionStatus />
              <Link
                to="/preview"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors"
              >
                View My Website <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <div className="max-w-5xl mx-auto">
            {children(activeTab, setActiveTab)}
          </div>
        </div>
      </main>
    </div>
  );
};
