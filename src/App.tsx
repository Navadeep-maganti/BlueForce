import React, { useState, useEffect } from 'react';
import { I18nProvider } from './i18n/context';
import { useStore } from './hooks/useStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WorkerMobileNav } from './components/layout/WorkerMobileNav';
import { VoiceSearchModal } from './components/voice/VoiceSearchModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { ShieldAlert, ArrowRight } from 'lucide-react';

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
  const user = store.currentUser;

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

  // Access Denied Screen Component
  const renderAccessDenied = (requiredRole: string, redirectPath: string) => (
    <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-white border border-red-200 text-center shadow-lg space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-base font-black text-navy">Access Restricted</h2>
      <p className="text-xs text-slate-600 leading-relaxed">
        This area is restricted to <strong>{requiredRole.toUpperCase()}</strong> accounts.
        {user ? (
          <> You are currently signed in as a <strong>{user.role.toUpperCase()}</strong>.</>
        ) : (
          <> You must sign in to view this page.</>
        )}
      </p>
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={() => navigate(redirectPath)}
          className="btn btn-primary text-xs py-2.5 flex items-center justify-center gap-1 font-bold"
        >
          {user ? `Go to My ${user.role === 'worker' ? 'Worker' : 'Employer'} Dashboard` : 'Sign In / Register'} <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => navigate(user ? (user.role === 'worker' ? '/worker/dashboard' : '/employer/dashboard') : '/')}
          className="btn btn-secondary text-xs py-2"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  // Render Page Content based on Path with Role Guarding
  const renderRoute = () => {
    // Root URL ("/") Behavior:
    // - Unauthenticated guests see the public marketing LandingPage
    // - Logged-in users are automatically kept in their role-specific dashboard (never see marketing landing)
    if (currentPath === '/' || currentPath === '') {
      if (user) {
        if (user.role === 'worker') {
          return <WorkerDashboard onNavigate={navigate} onOpenVoiceModal={() => setVoiceModalOpen(true)} />;
        }
        if (user.role === 'employer') {
          return <EmployerDashboard onNavigate={navigate} />;
        }
        if (user.role === 'admin') {
          return <AdminDashboard onNavigate={navigate} />;
        }
      }
      return <LandingPage onNavigate={navigate} onOpenVoiceModal={() => setVoiceModalOpen(true)} />;
    }

    // Auth Routes - if already logged in, route to active role workspace
    if (currentPath.startsWith('/auth')) {
      if (user) {
        if (user.role === 'worker') return <WorkerDashboard onNavigate={navigate} onOpenVoiceModal={() => setVoiceModalOpen(true)} />;
        if (user.role === 'employer') return <EmployerDashboard onNavigate={navigate} />;
        if (user.role === 'admin') return <AdminDashboard onNavigate={navigate} />;
      }
      const roleParam = currentPath.includes('role=employer') ? 'employer' : 'worker';
      return <AuthPage onNavigate={navigate} defaultRole={roleParam} />;
    }

    // Public / Shared Jobs Directory
    if (currentPath === '/jobs') {
      return (
        <JobDiscoveryPage
          onNavigate={navigate}
          onOpenVoiceModal={() => setVoiceModalOpen(true)}
          initialSearch={voiceSearchQuery}
        />
      );
    }

    // Role-Guarded Worker Routes
    if (currentPath.startsWith('/worker')) {
      if (!user) {
        return renderAccessDenied('Worker', '/auth?role=worker');
      }
      if (user.role !== 'worker' && user.role !== 'admin') {
        return renderAccessDenied('Worker', '/employer/dashboard');
      }

      if (currentPath === '/worker/dashboard') {
        return <WorkerDashboard onNavigate={navigate} onOpenVoiceModal={() => setVoiceModalOpen(true)} />;
      }

      if (currentPath === '/worker/jobs') {
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
    }

    // Role-Guarded Employer Routes
    if (currentPath.startsWith('/employer')) {
      if (!user) {
        return renderAccessDenied('Employer', '/auth?role=employer');
      }
      if (user.role !== 'employer' && user.role !== 'admin') {
        return renderAccessDenied('Employer', '/worker/dashboard');
      }

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
    }

    // Role-Guarded Admin Routes
    if (currentPath.startsWith('/admin')) {
      if (!user) {
        return renderAccessDenied('Admin', '/auth');
      }
      if (user.role !== 'admin') {
        return renderAccessDenied('Admin', user.role === 'worker' ? '/worker/dashboard' : '/employer/dashboard');
      }

      if (currentPath === '/admin/dashboard') {
        return <AdminDashboard onNavigate={navigate} />;
      }
    }

    // Fallback: If logged in, go to role dashboard, else LandingPage
    if (user) {
      if (user.role === 'worker') return <WorkerDashboard onNavigate={navigate} onOpenVoiceModal={() => setVoiceModalOpen(true)} />;
      if (user.role === 'employer') return <EmployerDashboard onNavigate={navigate} />;
      if (user.role === 'admin') return <AdminDashboard onNavigate={navigate} />;
    }
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
      <main className="main-content" id="main-content">
        {renderRoute()}
      </main>

      {store.currentUser?.role === 'worker' && (
        <WorkerMobileNav
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenNotifications={() => setNotifDrawerOpen(true)}
          unreadCount={store.notifications.filter((notification) => !notification.isRead).length}
        />
      )}

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
