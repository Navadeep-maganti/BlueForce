import React, { useState } from 'react';
import { Bell, BriefcaseBusiness, Building2, LogOut, Menu, Mic, ShieldCheck, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useStore } from '../../hooks/useStore';
import { UserRole } from '../../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenVoiceModal: () => void;
  onOpenNotifDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenVoiceModal,
  onOpenNotifDrawer,
}) => {
  const { t } = useTranslation(['navigation', 'employer', 'common']);
  const store = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = store.currentUser;
  const unread = store.notifications.filter((item) => !item.isRead).length;

  const navigate = (path: string) => {
    onNavigate(path);
    setMenuOpen(false);
  };

  const switchRole = (role: UserRole) => {
    store.loginAs(role);
    navigate(
      role === 'worker'
        ? '/worker/dashboard'
        : role === 'employer'
        ? '/employer/dashboard'
        : '/admin/dashboard'
    );
  };

  const links = !user
    ? [
        { label: t('navigation:findWork', 'Find work'), path: '/jobs' },
        { label: t('navigation:hireTalent', 'Hire talent'), path: '/auth?role=employer' },
      ]
    : user.role === 'worker'
    ? [
        { label: t('navigation:dashboard', 'Dashboard'), path: '/worker/dashboard' },
        { label: t('navigation:jobs', 'Jobs'), path: '/worker/jobs' },
        { label: t('navigation:applications', 'My applications'), path: '/worker/applications' },
        { label: t('navigation:profile', 'My profile'), path: '/worker/profile' },
      ]
    : user.role === 'employer'
    ? [
        { label: t('navigation:dashboard', 'Dashboard'), path: '/employer/dashboard' },
        { label: t('navigation:candidates', 'Candidates'), path: '/employer/candidates' },
        { label: t('navigation:pipeline', 'Pipeline'), path: '/employer/pipeline' },
        { label: t('navigation:analytics', 'Analytics'), path: '/employer/analytics' },
      ]
    : [{ label: t('navigation:verification', 'Verification centre'), path: '/admin/dashboard' }];

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <button
          className="brand"
          onClick={() =>
            navigate(
              !user
                ? '/'
                : user.role === 'worker'
                ? '/worker/dashboard'
                : user.role === 'employer'
                ? '/employer/dashboard'
                : '/admin/dashboard'
            )
          }
          aria-label={`${t('navigation:brandName', 'KaushalConnect')} home`}
        >
          <span className="brand__mark">
            <ShieldCheck size={19} />
          </span>
          <span>
            Kaushal<b>Connect</b>
          </span>
        </button>

        <nav className="app-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <button
              key={link.path}
              className={currentPath === link.path ? 'is-active' : ''}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </button>
          ))}
          {user?.role === 'employer' && (
            <button
              className="app-nav__post"
              onClick={() => navigate('/employer/jobs/new')}
            >
              {t('employer:postNewJob', 'Post a job')}
            </button>
          )}
        </nav>

        <div className="app-header__actions">
          {/* Voice Search */}
          <button
            className="header-icon header-icon--voice"
            onClick={onOpenVoiceModal}
            aria-label={t('navigation:voiceSearch', 'Voice search')}
            title={t('navigation:voiceSearch', 'Voice search')}
          >
            <Mic size={18} />
          </button>

          {/* Multilingual Switcher Dropdown */}
          <LanguageSwitcher variant="header" />

          {/* Notifications Trigger - Only for Authenticated Users */}
          {user && (
            <button
              className="header-icon notification-button"
              onClick={onOpenNotifDrawer}
              aria-label={t('navigation:notifications', 'Open notifications')}
            >
              <Bell size={18} />
              {unread > 0 && <span>{unread}</span>}
            </button>
          )}

          {/* User Profile or Auth Buttons */}
          {user ? (
            <div className="user-menu">
              <button
                onClick={() =>
                  navigate(
                    user.role === 'worker'
                      ? '/worker/profile'
                      : user.role === 'employer'
                      ? '/employer/dashboard'
                      : '/admin/dashboard'
                  )
                }
              >
                <img
                  src={
                    user.avatarUrl ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
                  }
                  alt=""
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-slate-200"
                  style={{ width: '28px', height: '28px', minWidth: '28px', maxWidth: '28px', borderRadius: '9999px', objectFit: 'cover' }}
                />
                <span>{user.name}</span>
              </button>
              <button
                className="sign-out"
                onClick={() => {
                  store.logout();
                  navigate('/');
                }}
                title={t('navigation:logout', 'Log out')}
                aria-label={t('navigation:logout', 'Log out')}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <button onClick={() => navigate('/auth?mode=login')}>
                {t('navigation:login', 'Sign in')}
              </button>
              <button onClick={() => navigate('/auth?mode=register')}>
                {t('navigation:register', 'Get started')}
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="header-icon menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu__links">
            {links.map((link) => (
              <button
                key={link.path}
                className={currentPath === link.path ? 'is-active' : ''}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            ))}
            {user?.role === 'employer' && (
              <button onClick={() => navigate('/employer/jobs/new')}>
                {t('employer:postNewJob', 'Post a job')}
              </button>
            )}
            {!user && (
              <>
                <button onClick={() => navigate('/auth?mode=login')}>
                  {t('navigation:login', 'Sign in')}
                </button>
                <button onClick={() => navigate('/auth?mode=register')}>
                  {t('navigation:register', 'Get started')}
                </button>
              </>
            )}
          </div>

          {/* Mobile Language Switcher */}
          <div className="p-3">
            <LanguageSwitcher variant="mobile" onSelect={() => setMenuOpen(false)} />
          </div>

          <div className="role-switch">
            <span>{t('navigation:switchRole', 'Switch view')}</span>
            <button onClick={() => switchRole('worker')}>
              <BriefcaseBusiness size={15} /> {t('navigation:switchRoleWorker', 'Worker')}
            </button>
            <button onClick={() => switchRole('employer')}>
              <Building2 size={15} /> {t('navigation:switchRoleEmployer', 'Employer')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
