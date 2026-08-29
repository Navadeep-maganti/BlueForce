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
  const store = useStore();
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    const t = type?.toUpperCase() || '';
    if (t.includes('INTERVIEW_SCHEDULED') || t.includes('INTERVIEW')) {
      return <Clock className="w-4 h-4 text-blue-600" />;
    }
    if (t.includes('INTERVIEW_CANCELLED')) {
      return <Clock className="w-4 h-4 text-red-500" />;
    }
    if (t.includes('APPLICATION_RECEIVED') || t.includes('SHORTLISTED')) {
      return <UserCheck className="w-4 h-4 text-emerald-600" />;
    }
    if (t.includes('VERIFICATION_APPROVED') || t.includes('VERIFICATION')) {
      return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
    if (t.includes('VERIFICATION_REJECTED')) {
      return <ShieldAlert className="w-4 h-4 text-amber-600" />;
    }
    if (t.includes('JOB_RECOMMENDATION') || t.includes('JOB_MATCH')) {
      return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
    if (t.includes('APPLICATION_STATUS_CHANGED') || t.includes('APPLICATION_UPDATE')) {
      return <CheckCircle2 className="w-4 h-4 text-indigo-600" />;
    }
    return <Bell className="w-4 h-4 text-slate-600" />;
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    store.markNotificationRead(notif.id);
    if (notif.actionUrl) {
      onNavigate(notif.actionUrl);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content max-w-md ml-auto mr-4 h-full max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-navy text-sm sm:text-base">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="badge badge-primary text-[10px] px-1.5 py-0.5">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted">Real-time alerts for interviews, applications & audits</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={() => store.markAllNotificationsRead()}
                className="text-[11px] font-bold text-primary hover:underline px-2 py-1 flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
            <button onClick={onClose} className="btn-icon">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-navy">No notifications right now</h4>
                <p className="text-[11px] text-muted mt-0.5">
                  You're all caught up! New job applications and interview updates will appear here.
                </p>
              </div>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-white hover:bg-slate-50 border-slate-200 opacity-80'
                    : 'bg-blue-50/70 hover:bg-blue-50 border-blue-200 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-white border shadow-xs flex-shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-bold truncate ${notif.isRead ? 'text-slate-800' : 'text-navy'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-muted flex-shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.actionUrl && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary mt-2 hover:underline">
                        View details <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
