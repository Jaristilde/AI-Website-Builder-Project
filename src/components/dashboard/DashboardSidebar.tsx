import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar,
  UserCircle,
  Settings, 
  ChevronRight, 
  ExternalLink,
  Edit3,
  Globe
} from 'lucide-react';
import { DashboardTab } from '../../types/crm';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems: { id: DashboardTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'clients', label: 'Clients', icon: UserCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-zinc-100 h-screen sticky top-0">
        <div className="p-8">
          <Link to="/" className="flex items-center group">
            <img src="/my1stwebsite_logo_purple.png" alt="My1stWebsite" className="h-12 group-hover:scale-105 transition-transform" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                    ? 'bg-purple-50 text-purple-600' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-zinc-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 space-y-2">
          <Link 
            to="/builder"
            className="flex items-center justify-between w-full px-4 py-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-sm font-bold text-zinc-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-zinc-400" />
              Edit Website
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
          </Link>
          <Link 
            to="/preview"
            className="flex items-center justify-between w-full px-4 py-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-sm font-bold text-zinc-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-zinc-400" />
              View Website
            </span>
            <ExternalLink className="w-4 h-4 text-zinc-300" />
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-6 py-3 flex items-center justify-between z-40">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-purple-600' : 'text-zinc-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
