import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { BuilderProvider } from './context/BuilderContext';
import { GoogleProvider } from './context/GoogleContext';
import { AuthProvider } from './context/AuthContext';
import { detectSubdomain } from './lib/subdomain';
import App from './App.tsx';
import PublishedSitePage from './pages/PublishedSitePage';
import './index.css';

const subdomainInfo = detectSubdomain();
const isPublishedSite = subdomainInfo.isSubdomain && !!subdomainInfo.slug;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BuilderProvider readOnly={isPublishedSite}>
          <GoogleProvider>
            {isPublishedSite ? (
              <PublishedSitePage slug={subdomainInfo.slug!} />
            ) : (
              <App />
            )}
          </GoogleProvider>
        </BuilderProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
