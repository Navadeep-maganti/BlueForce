import React from 'react';
import { NotificationItem } from '../../types';
import { X, Bell, CheckCircle2, Briefcase, Award, ShieldAlert, Clock, ArrowRight } from 'lucide-react';

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
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'interview':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'job_match':
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'verification':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'application_update':
        return <CheckCircle2 className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content max-w-md ml-auto mr-4 h-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-navy">Notifications</h3>
            <span className="badge badge-primary text-xs">
              {notifications.filter((n) => !n.isRead).length} new
            </span>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted text-sm">
              No notifications yet
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.actionUrl) {
                    onNavigate(notif.actionUrl);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-white hover:bg-slate-50 border-slate-200'
                    : 'bg-blue-50/60 hover:bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-white border shadow-xs">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-navy">{notif.title}</h4>
                      <span className="text-[10px] text-muted">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
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
