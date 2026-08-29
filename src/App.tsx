import React, { useState, useEffect } from 'react';
import { I18nProvider } from './i18n/context';
import { useStore } from './hooks/useStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { VoiceSearchModal } from './components/voice/VoiceSearchModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';

// Pages
import { LandingPage } from './pages/public/LandingPage';
import { AuthPage } from './pages/public/AuthPage';
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { JobDiscoveryPage } from './pages/worker/JobDiscoveryPage';
import { JobDetailPage } from './pages/worker/JobDetailPage';
import { ApplicationTrackingPage } from './pages/worker/ApplicationTrackingPage';
import { WorkerProfilePage } from './pages/worker/WorkerProfilePage';
import { EmployerDashboard } from './pages/employer/EmployerDashboard';
import { JobCreationPage } from './pages/employer/JobCreationPage';
import { CandidateDiscoveryPage } from './pages/employer/CandidateDiscoveryPage';
import { RecruitmentPipelinePage } from './pages/employer/RecruitmentPipelinePage';
import { EmployerAnalyticsPage } from './pages/employer/EmployerAnalyticsPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

import './styles/base.css';
import './styles/components.css';
import './styles/utilities.css';
import './styles/landing.css';
import './styles/navigation.css';
import './styles/footer.css';
import './styles/production-ui.css';

export const AppContent: React.FC = () => {
  const store = useStore();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [voiceSearchQuery, setVoiceSearchQuery] = useState<{ keyword: string; location: string; minSalary: number } | undefined>(undefined);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleVoiceSearch = (params: { keyword: string; location: string; minSalary: number }) => {
    setVoiceSearchQuery(params);
    navigate('/worker/jobs');
  };

  // Render Page Content based on Path
  const renderRoute = () => {
    if (currentPath === '/') {
      return <LandingPage onNavigate={navigate} onOpenVoiceModal={() => setVoiceModalOpen(true)} />;
    }

    if (currentPath.startsWith('/auth')) {
      const roleParam = currentPath.includes('role=employer') ? 'employer' : 'worker';
      return <AuthPage onNavigate={navigate} defaultRole={roleParam} />;
    }

    // Worker Routes
    if (currentPath === '/worker/dashboard') {
      return <WorkerDashboard onNavigate={navigate} onOpenVoiceModal={() => setVoiceModalOpen(true)} />;
    }

    if (currentPath === '/jobs' || currentPath === '/worker/jobs') {
      return (
        <JobDiscoveryPage
          onNavigate={navigate}
          onOpenVoiceModal={() => setVoiceModalOpen(true)}
          initialSearch={voiceSearchQuery}
        />
      );
    }

    if (currentPath.startsWith('/worker/jobs/')) {
      const jobId = currentPath.replace('/worker/jobs/', '');
      return <JobDetailPage jobId={jobId} onNavigate={navigate} />;
    }

    if (currentPath === '/worker/applications') {
      return <ApplicationTrackingPage onNavigate={navigate} />;
    }

    if (currentPath === '/worker/profile') {
      return <WorkerProfilePage onNavigate={navigate} />;
    }

    // Employer Routes
    if (currentPath === '/employer/dashboard') {
      return <EmployerDashboard onNavigate={navigate} />;
    }

    if (currentPath === '/employer/jobs/new') {
      return <JobCreationPage onNavigate={navigate} />;
    }

    if (currentPath === '/employer/candidates') {
      return <CandidateDiscoveryPage onNavigate={navigate} />;
    }

    if (currentPath === '/employer/pipeline') {
      return <RecruitmentPipelinePage onNavigate={navigate} />;
    }

    if (currentPath === '/employer/analytics') {
      return <EmployerAnalyticsPage onNavigate={navigate} />;
    }

    // Admin Routes
    if (currentPath === '/admin/dashboard') {
      return <AdminDashboard onNavigate={navigate} />;
    }

    // Fallback
    return <LandingPage onNavigate={navigate} onOpenVoiceModal={() => setVoiceModalOpen(true)} />;
  };

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenVoiceModal={() => setVoiceModalOpen(true)}
        onOpenNotifDrawer={() => setNotifDrawerOpen(true)}
      />

      {/* Main Page Area */}
      <main className="main-content">
        {renderRoute()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Voice Search Dialog */}
      <VoiceSearchModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSearch={handleVoiceSearch}
      />

      {/* Slide-out Notification Center */}
      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        notifications={store.notifications}
        onNavigate={navigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
