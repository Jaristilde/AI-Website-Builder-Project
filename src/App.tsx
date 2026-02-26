import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WizardPage from './pages/WizardPage';
import PreviewPage from './pages/PreviewPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import PublishedSitePage from './pages/PublishedSitePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/builder" element={<WizardPage />} />
      <Route path="/preview" element={<PreviewPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/site/:slug" element={<PublishedSitePage />} />
    </Routes>
  );
}
