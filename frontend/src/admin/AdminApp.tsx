import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSkeleton from './components/common/LoadingSkeleton';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import { adminStore } from './store';
import './admin.css';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const HeroPage = lazy(() => import('./pages/HeroPage'));
const FounderPage = lazy(() => import('./pages/FounderPage'));
const BusinessesPage = lazy(() => import('./pages/BusinessesPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const NavigationPage = lazy(() => import('./pages/NavigationPage'));
const FooterPage = lazy(() => import('./pages/FooterPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const WebsiteSettingsPage = lazy(() => import('./pages/WebsiteSettingsPage'));
const SocialPage = lazy(() => import('./pages/SocialPage'));
const BrandingPage = lazy(() => import('./pages/BrandingPage'));
const MediaLibraryPage = lazy(() => import('./pages/MediaLibraryPage'));
const SeoPage = lazy(() => import('./pages/SeoPage'));

const HomepagePage = lazy(() => import('./pages/HomepagePage'));
const CulturePagePage = lazy(() => import('./pages/CulturePagePage'));
const ImpactPagePage = lazy(() => import('./pages/ImpactPagePage'));
const CareersPagePage = lazy(() => import('./pages/CareersPagePage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const ContactPagePage = lazy(() => import('./pages/ContactPagePage'));
const OfficesPage = lazy(() => import('./pages/OfficesPage'));
const InvestorsPagePage = lazy(() => import('./pages/InvestorsPagePage'));
const FinancialReportsPage = lazy(() => import('./pages/FinancialReportsPage'));
const ShareholdingPatternsPage = lazy(() => import('./pages/ShareholdingPatternsPage'));
const BoardMembersPage = lazy(() => import('./pages/BoardMembersPage'));

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="admin-root p-6"><LoadingSkeleton rows={4} /></div>}>{children}</Suspense>;
}

export default function AdminApp() {
  return (
    <Provider store={adminStore}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
          },
        }}
      />
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LazyPage><DashboardPage /></LazyPage>} />
          <Route path="homepage" element={<LazyPage><HomepagePage /></LazyPage>} />
          <Route path="hero" element={<LazyPage><HeroPage /></LazyPage>} />
          <Route path="founder" element={<LazyPage><FounderPage /></LazyPage>} />
          <Route path="businesses" element={<LazyPage><BusinessesPage /></LazyPage>} />
          <Route path="services" element={<LazyPage><ServicesPage /></LazyPage>} />
          <Route path="culture-page" element={<LazyPage><CulturePagePage /></LazyPage>} />
          <Route path="careers-page" element={<LazyPage><CareersPagePage /></LazyPage>} />
          <Route path="jobs" element={<LazyPage><JobsPage /></LazyPage>} />
          <Route path="impact-page" element={<LazyPage><ImpactPagePage /></LazyPage>} />
          <Route path="contact-page" element={<LazyPage><ContactPagePage /></LazyPage>} />
          <Route path="offices" element={<LazyPage><OfficesPage /></LazyPage>} />
          <Route path="investors-page" element={<LazyPage><InvestorsPagePage /></LazyPage>} />
          <Route path="financial-reports" element={<LazyPage><FinancialReportsPage /></LazyPage>} />
          <Route path="shareholding-patterns" element={<LazyPage><ShareholdingPatternsPage /></LazyPage>} />
          <Route path="board-members" element={<LazyPage><BoardMembersPage /></LazyPage>} />
          <Route path="navigation" element={<LazyPage><NavigationPage /></LazyPage>} />
          <Route path="footer" element={<LazyPage><FooterPage /></LazyPage>} />
          <Route path="contact" element={<LazyPage><ContactPage /></LazyPage>} />
          <Route path="company-information" element={<LazyPage><WebsiteSettingsPage /></LazyPage>} />
          <Route path="website-settings" element={<LazyPage><WebsiteSettingsPage /></LazyPage>} />
          <Route path="social" element={<LazyPage><SocialPage /></LazyPage>} />
          <Route path="branding" element={<LazyPage><BrandingPage /></LazyPage>} />
          <Route path="media" element={<LazyPage><MediaLibraryPage /></LazyPage>} />
          <Route path="seo" element={<LazyPage><SeoPage /></LazyPage>} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Provider>
  );
}
