import React from 'react';
import { NotificationItem } from '../../types';
import {
  X,
  Bell,
  CheckCircle2,
  Briefcase,
  Award,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
  UserCheck,
  CheckCheck,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../hooks/useStore';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onNavigate: (url: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onNavigate,
}) => {
  const { t } = useTranslation(['navigation', 'common', 'applications']);
  const store = useStore();
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    const tp = type?.toUpperCase() || '';
    if (tp.includes('INTERVIEW_SCHEDULED') || tp.includes('INTERVIEW')) {
      return <Clock className="w-4 h-4 text-blue-600" />;
    }
    if (tp.includes('INTERVIEW_CANCELLED')) {
      return <Clock className="w-4 h-4 text-red-500" />;
    }
    if (tp.includes('APPLICATION_RECEIVED') || tp.includes('SHORTLISTED')) {
      return <UserCheck className="w-4 h-4 text-emerald-600" />;
    }
    if (tp.includes('VERIFICATION_APPROVED') || tp.includes('VERIFICATION')) {
      return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
    if (tp.includes('VERIFICATION_REJECTED')) {
      return <ShieldAlert className="w-4 h-4 text-amber-600" />;
    }
    if (tp.includes('JOB_RECOMMENDATION') || tp.includes('JOB_MATCH')) {
      return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
    if (tp.includes('APPLICATION_STATUS_CHANGED') || tp.includes('APPLICATION_UPDATE')) {
      return <CheckCircle2 className="w-4 h-4 text-indigo-600" />;
    }
    return <Bell className="w-4 h-4 text-slate-600" />;
  };

  const handleItemClick = (n: NotificationItem) => {
    if (!n.isRead) {
      store.markNotificationRead(n.id);
    }
    if (n.actionUrl) {
      onNavigate(n.actionUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l shadow-2xl flex flex-col justify-between">
          {/* Top Bar */}
          <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-navy">
                  {t('navigation:notifications', 'Notification Center')}
                </h2>
                <span className="text-[10px] text-muted">
                  {unreadCount > 0
                    ? `${unreadCount} unread alerts`
                    : t('common:status.completed', 'All caught up')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={() => store.markAllNotificationsRead()}
                  className="btn btn-secondary py-1 px-2 text-[10px] flex items-center gap-1 font-bold"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3 text-emerald-600" />
                  <span>{t('common:actions.clearAll', 'Mark all read')}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto divide-y">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-muted">
                <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-navy">
                  {t('common:emptyState.noResults', 'No notifications yet')}
                </p>
                <p className="text-[11px] mt-0.5">
                  Interview calls and verification status changes will appear here.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={`p-4 transition-all cursor-pointer flex items-start gap-3 hover:bg-slate-50 ${
                    !n.isRead ? 'bg-blue-50/40 border-l-4 border-primary' : 'bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border shadow-2xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-navy">{n.title}</h4>
                      <span className="text-[9px] text-muted whitespace-nowrap">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                    {n.actionUrl && (
                      <span className="text-[10px] font-bold text-primary inline-flex items-center gap-0.5 pt-0.5">
                        {t('common:actions.viewDetails', 'View details')} <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
