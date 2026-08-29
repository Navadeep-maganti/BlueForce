import React from 'react';
import { Bell, BriefcaseBusiness, House, Search, UserRound } from 'lucide-react';

interface WorkerMobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const WorkerMobileNav: React.FC<WorkerMobileNavProps> = ({ currentPath, onNavigate, onOpenNotifications, unreadCount }) => {
  const items = [
    { label: 'Home', path: '/worker/dashboard', icon: House },
    { label: 'Find jobs', path: '/worker/jobs', icon: Search },
    { label: 'Applications', path: '/worker/applications', icon: BriefcaseBusiness },
    { label: 'Profile', path: '/worker/profile', icon: UserRound },
  ];

  return (
    <nav className="worker-mobile-nav" aria-label="Worker quick navigation">
      {items.map(({ label, path, icon: Icon }) => (
        <button key={path} type="button" className={currentPath === path ? 'is-active' : ''} onClick={() => onNavigate(path)}>
          <Icon size={19} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
      <button type="button" onClick={onOpenNotifications} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}>
        <span className="worker-mobile-nav__icon"><Bell size={19} aria-hidden="true" />{unreadCount > 0 && <i>{unreadCount > 9 ? '9+' : unreadCount}</i>}</span>
        <span>Alerts</span>
      </button>
    </nav>
  );
};
