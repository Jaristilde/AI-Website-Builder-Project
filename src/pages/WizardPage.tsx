import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import WizardShell from '../components/wizard/WizardShell';
import { useBuilder } from '../context/BuilderContext';
import { useAuth } from '../context/AuthContext';
import { getWebsite } from '../lib/website-service';

const WizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { websiteId } = useParams<{ websiteId?: string }>();
  const autoShowImport = searchParams.get('mode') === 'import';
  const { state, dispatch } = useBuilder();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Load website from Firestore if websiteId param is provided and not already loaded
  useEffect(() => {
    if (!websiteId || !user || state.activeWebsiteId === websiteId) return;

    setLoading(true);
    getWebsite(user.uid, websiteId).then((website) => {
      if (website) {
        dispatch({
          type: 'LOAD_WEBSITE',
          payload: {
            data: website.businessData,
            step: website.wizardStep,
            websiteId: website.id,
            publishState: website.publishState,
          },
        });
      }
      setLoading(false);
    });
  }, [websiteId, user, state.activeWebsiteId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-zinc-200 border-t-purple-600 rounded-full" />
      </div>
    );
  }

  return <WizardShell autoShowImport={autoShowImport} />;
};

export default WizardPage;
