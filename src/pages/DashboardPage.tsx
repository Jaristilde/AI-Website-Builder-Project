import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBuilder } from '../context/BuilderContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { OverviewPanel } from '../components/dashboard/OverviewPanel';
import { LeadsPanel } from '../components/dashboard/LeadsPanel';
import { AppointmentsPanel } from '../components/dashboard/AppointmentsPanel';
import { ClientsPanel } from '../components/dashboard/ClientsPanel';
import { PublishPanel } from '../components/dashboard/PublishPanel';
import { SettingsPanel } from '../components/dashboard/SettingsPanel';
import { DashboardTab } from '../types/crm';

const DashboardPage: React.FC = () => {
  const { businessData } = useBuilder();
  const navigate = useNavigate();

  useEffect(() => {
    if (!businessData) {
      navigate('/builder');
    }
  }, [businessData, navigate]);

  if (!businessData) return null;

  return (
    <DashboardLayout>
      {(activeTab) => (
        <>
          {activeTab === 'overview' && <OverviewPanel />}
          {activeTab === 'leads' && <LeadsPanel />}
          {activeTab === 'appointments' && <AppointmentsPanel />}
          {activeTab === 'clients' && <ClientsPanel />}
          {activeTab === 'publish' && <PublishPanel />}
          {activeTab === 'settings' && <SettingsPanel />}
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
