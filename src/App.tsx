import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WizardPage from './pages/WizardPage';
import PreviewPage from './pages/PreviewPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import PublishedSitePage from './pages/PublishedSitePage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/builder" element={<WizardPage />} />
      <Route path="/preview" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/site/:slug" element={<PublishedSitePage />} />
    </Routes>
  );
}
