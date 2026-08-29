import React from 'react';
import { Bell, BriefcaseBusiness, House, Search, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WorkerMobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const WorkerMobileNav: React.FC<WorkerMobileNavProps> = ({
  currentPath,
  onNavigate,
  onOpenNotifications,
  unreadCount,
}) => {
  const { t } = useTranslation(['navigation', 'common']);

  const items = [
    { label: t('navigation:dashboard', 'Home'), path: '/worker/dashboard', icon: House },
    { label: t('navigation:jobs', 'Jobs'), path: '/worker/jobs', icon: Search },
    { label: t('navigation:applications', 'Applications'), path: '/worker/applications', icon: BriefcaseBusiness },
    { label: t('navigation:profile', 'Profile'), path: '/worker/profile', icon: UserRound },
  ];

  return (
    <nav className="worker-mobile-nav" aria-label="Worker quick navigation">
      {items.map(({ label, path, icon: Icon }) => (
        <button
          key={path}
          type="button"
          className={currentPath === path ? 'is-active' : ''}
          onClick={() => onNavigate(path)}
        >
          <Icon size={19} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onOpenNotifications}
        aria-label={`${t('navigation:notifications', 'Notifications')}${
          unreadCount ? `, ${unreadCount} unread` : ''
        }`}
      >
        <span className="worker-mobile-nav__icon">
          <Bell size={19} aria-hidden="true" />
          {unreadCount > 0 && <i>{unreadCount > 9 ? '9+' : unreadCount}</i>}
        </span>
        <span>{t('navigation:notifications', 'Alerts')}</span>
      </button>
    </nav>
  );
};
