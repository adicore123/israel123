import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import AccessibilityPage from './pages/AccessibilityPage.jsx';
import ServiceDashboardPage from './pages/ServiceDashboardPage.jsx';
import LogsPage from './pages/LogsPage.jsx';
import WarrantyPage from './pages/WarrantyPage.jsx';
import './index.css';

const rootElement = document.getElementById('root');
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/service" element={<ServiceDashboardPage />} />
          <Route path="/servvice" element={<ServiceDashboardPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/warranty/:id" element={<WarrantyPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
