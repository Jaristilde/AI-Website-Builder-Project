import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { BuilderProvider } from './context/BuilderContext';
import { GoogleProvider } from './context/GoogleContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BuilderProvider>
        <GoogleProvider>
          <App />
        </GoogleProvider>
      </BuilderProvider>
    </BrowserRouter>
  </StrictMode>,
);
