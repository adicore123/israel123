import App from './App.jsx';
import Root from './Root.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import AccessibilityPage from './pages/AccessibilityPage.jsx';
import LogsPage from './pages/LogsPage.jsx';
import ServiceDashboardPage from './pages/ServiceDashboardPage.jsx';

export const routes = [
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <App /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'accessibility', element: <AccessibilityPage /> },
      { path: 'logs', element: <LogsPage /> },
      { path: 'service', element: <ServiceDashboardPage /> },
      { path: 'servvice', element: <ServiceDashboardPage /> },
    ],
  },
];
