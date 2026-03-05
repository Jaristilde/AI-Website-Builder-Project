import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../context/BuilderContext';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { OverviewPanel } from '../components/dashboard/OverviewPanel';
import { LeadsPanel } from '../components/dashboard/LeadsPanel';
import { AppointmentsPanel } from '../components/dashboard/AppointmentsPanel';
import { ClientsPanel } from '../components/dashboard/ClientsPanel';
import { PublishPanel } from '../components/dashboard/PublishPanel';
import { SettingsPanel } from '../components/dashboard/SettingsPanel';
import { listWebsites, createWebsite, deleteWebsite, updatePublishState, WebsiteListItem } from '../lib/website-service';
import { BusinessData, WizardStep } from '../types/builder';
import { Plus, Globe, Edit3, Eye, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';

const DashboardPage: React.FC = () => {
  const { state, dispatch, businessData } = useBuilder();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<WebsiteListItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch user's websites
  useEffect(() => {
    if (!user) return;

    setLoadingList(true);
    listWebsites(user.uid).then(async (sites) => {
      // Migration: if no sites in Firestore but localStorage has data
      if (sites.length === 0) {
        try {
          const saved = localStorage.getItem('builder_state');
          if (saved) {
            const parsed = JSON.parse(saved) as { data: BusinessData; step: WizardStep };
            if (parsed.data?.businessName?.trim()) {
              const publishSaved = localStorage.getItem('publish_state');
              const publishState = publishSaved
                ? JSON.parse(publishSaved)
                : { isPublished: false, slug: null, publishToken: null, url: null };

              const newId = await createWebsite(user.uid, parsed.data, parsed.step || 1);
              localStorage.removeItem('builder_state');
              localStorage.removeItem('publish_state');

              // Reload the list after migration
              const updatedSites = await listWebsites(user.uid);
              setWebsites(updatedSites);

              // If publish state exists, save it too
              if (publishState.isPublished) {
                await updatePublishState(user.uid, newId, publishState);
              }

              setLoadingList(false);
              return;
            }
          }
        } catch (err) {
          console.error('Migration failed:', err);
        }
      }

      setWebsites(sites);
      setLoadingList(false);
    });
  }, [user]);

  const handleCreateNew = () => {
    dispatch({ type: 'RESET' });
    navigate('/builder');
  };

  const handleEdit = (site: WebsiteListItem) => {
    dispatch({
      type: 'LOAD_WEBSITE',
      payload: {
        data: site.businessData,
        step: site.wizardStep,
        websiteId: site.id,
        publishState: site.publishState,
      },
    });
    navigate(`/builder/${site.id}`);
  };

  const handlePreview = (site: WebsiteListItem) => {
    dispatch({
      type: 'LOAD_WEBSITE',
      payload: {
        data: site.businessData,
        step: site.wizardStep,
        websiteId: site.id,
        publishState: site.publishState,
      },
    });
    navigate('/preview');
  };

  const handleDelete = async (siteId: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this website?')) return;
    setDeleting(siteId);
    try {
      await deleteWebsite(user.uid, siteId);
      setWebsites((prev) => prev.filter((s) => s.id !== siteId));
      // If this was the active website, reset
      if (state.activeWebsiteId === siteId) {
        dispatch({ type: 'RESET' });
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
    setDeleting(null);
  };

  const handleBack = () => {
    dispatch({ type: 'RESET' });
  };

  const handleOpenDashboard = (site: WebsiteListItem) => {
    dispatch({
      type: 'LOAD_WEBSITE',
      payload: {
        data: site.businessData,
        step: site.wizardStep,
        websiteId: site.id,
        publishState: site.publishState,
      },
    });
  };

  // If an active website is loaded, show the single-website dashboard
  if (state.activeWebsiteId && businessData) {
    return (
      <DashboardLayout onBack={handleBack}>
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
  }

  // Website list view
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-100 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-zinc-900">My Websites</h1>
            <p className="text-sm text-zinc-500 font-medium">Manage all your websites in one place.</p>
          </div>
          <Button onClick={handleCreateNew} className="gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> Create New Website
          </Button>
        </div>
      </header>

      <main className="p-8">
        <div className="max-w-5xl mx-auto">
          {loadingList ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
            </div>
          ) : websites.length === 0 ? (
            // Empty state
            <div className="text-center py-24 space-y-6">
              <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto">
                <Globe className="w-10 h-10 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900">Create your first website</h2>
                <p className="text-zinc-500 mt-2 max-w-md mx-auto">
                  Get started by creating a beautiful website for your business in minutes.
                </p>
              </div>
              <Button onClick={handleCreateNew} className="gap-2 rounded-xl px-8 py-3">
                <Plus className="w-4 h-4" /> Create Website
              </Button>
            </div>
          ) : (
            // Website cards grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.map((site) => (
                <div
                  key={site.id}
                  className="bg-white border border-zinc-100 rounded-3xl p-6 space-y-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-zinc-900 truncate">
                        {site.name || 'Untitled Website'}
                      </h3>
                      <p className="text-sm text-zinc-500 capitalize">{site.businessData.businessType}</p>
                    </div>
                    {site.publishState?.isPublished && (
                      <span className="shrink-0 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Live
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400">
                    Updated {site.updatedAt?.toDate
                      ? site.updatedAt.toDate().toLocaleDateString()
                      : 'recently'}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDashboard(site)}
                      className="flex-1 gap-1 text-xs"
                    >
                      <Globe className="w-3 h-3" /> Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(site)}
                      className="flex-1 gap-1 text-xs"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(site)}
                      className="flex-1 gap-1 text-xs"
                    >
                      <Eye className="w-3 h-3" /> Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(site.id)}
                      disabled={deleting === site.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                    >
                      {deleting === site.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
