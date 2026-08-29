import React, { useState } from 'react';
import { Bell, BriefcaseBusiness, Building2, ChevronDown, Globe2, LogOut, Menu, Mic, ShieldCheck, X } from 'lucide-react';
import { useI18n } from '../../i18n/context';
import { LanguageCode } from '../../i18n/translations';
import { useStore } from '../../hooks/useStore';
import { UserRole } from '../../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenVoiceModal: () => void;
  onOpenNotifDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenVoiceModal, onOpenNotifDrawer }) => {
  const { language, setLanguage, t } = useI18n();
  const store = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [languagesOpen, setLanguagesOpen] = useState(false);
  const user = store.currentUser;
  const unread = store.notifications.filter((item) => !item.isRead).length;
  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिन्दी' },
  ];
  const navigate = (path: string) => { onNavigate(path); setMenuOpen(false); };
  const switchRole = (role: UserRole) => {
    store.loginAs(role);
    navigate(role === 'worker' ? '/worker/dashboard' : role === 'employer' ? '/employer/dashboard' : '/admin/dashboard');
  };
  const links = !user
    ? [{ label: t.nav.findWork, path: '/jobs' }, { label: t.nav.hireTalent, path: '/auth?role=employer' }]
    : user.role === 'worker'
      ? [{ label: t.nav.dashboard, path: '/worker/dashboard' }, { label: t.nav.jobs, path: '/worker/jobs' }, { label: t.nav.applications, path: '/worker/applications' }, { label: t.nav.profile, path: '/worker/profile' }]
      : user.role === 'employer'
        ? [{ label: t.nav.dashboard, path: '/employer/dashboard' }, { label: t.nav.candidates, path: '/employer/candidates' }, { label: t.nav.pipeline, path: '/employer/pipeline' }, { label: t.nav.analytics, path: '/employer/analytics' }]
        : [{ label: t.nav.verification, path: '/admin/dashboard' }];

  return <header className="app-header"><div className="app-header__inner">
    <button className="brand" onClick={() => navigate('/')} aria-label={`${t.appName} home`}><span className="brand__mark"><ShieldCheck size={19} /></span><span>Kaushal<b>Connect</b></span></button>
    <nav className="app-nav" aria-label="Primary navigation">{links.map((link) => <button key={link.path} className={currentPath === link.path ? 'is-active' : ''} onClick={() => navigate(link.path)}>{link.label}</button>)}{user?.role === 'employer' && <button className="app-nav__post" onClick={() => navigate('/employer/jobs/new')}>{t.employerDashboard.postNewJob}</button>}</nav>
    <div className="app-header__actions">
      <button className="header-icon header-icon--voice" onClick={onOpenVoiceModal} aria-label={t.nav.voiceSearch} title={t.nav.voiceSearch}><Mic size={18} /></button>
      <div className="language-picker"><button className="language-picker__trigger" onClick={() => setLanguagesOpen(!languagesOpen)} aria-expanded={languagesOpen} aria-label="Change language"><Globe2 size={16} /><span>{language.toUpperCase()}</span><ChevronDown size={14} /></button>{languagesOpen && <div className="language-picker__menu">{languages.map((item) => <button key={item.code} className={language === item.code ? 'is-selected' : ''} onClick={() => { setLanguage(item.code); setLanguagesOpen(false); }}>{item.label}</button>)}</div>}</div>
      <button className="header-icon notification-button" onClick={onOpenNotifDrawer} aria-label="Open notifications"><Bell size={18} />{unread > 0 && <span>{unread}</span>}</button>
      {user ? <div className="user-menu"><button onClick={() => navigate(user.role === 'worker' ? '/worker/profile' : user.role === 'employer' ? '/employer/dashboard' : '/admin/dashboard')}><img src={user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'} alt=""/><span>{user.name}</span></button><button className="sign-out" onClick={() => { store.logout(); navigate('/'); }} title={t.nav.logout} aria-label={t.nav.logout}><LogOut size={16} /></button></div> : <div className="auth-actions"><button onClick={() => navigate('/auth?mode=login')}>{t.nav.login}</button><button onClick={() => navigate('/auth?mode=register')}>{t.nav.register}</button></div>}
      <button className="header-icon menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
    </div>
  </div>{menuOpen && <div className="mobile-menu"><div className="mobile-menu__links">{links.map((link) => <button key={link.path} className={currentPath === link.path ? 'is-active' : ''} onClick={() => navigate(link.path)}>{link.label}</button>)}{user?.role === 'employer' && <button onClick={() => navigate('/employer/jobs/new')}>{t.employerDashboard.postNewJob}</button>}{!user && <><button onClick={() => navigate('/auth?mode=login')}>{t.nav.login}</button><button onClick={() => navigate('/auth?mode=register')}>{t.nav.register}</button></>}</div><div className="role-switch"><span>{t.nav.switchRole}</span><button onClick={() => switchRole('worker')}><BriefcaseBusiness size={15} /> Worker</button><button onClick={() => switchRole('employer')}><Building2 size={15} /> Employer</button></div></div>}</header>;
};
