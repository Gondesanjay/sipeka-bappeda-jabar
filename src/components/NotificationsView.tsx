import React from 'react';
import { Bell, Check, ChevronRight, Clock } from 'lucide-react';
import { getNotifications, Notification } from '../data/mockData';
import { EWSBadge } from './EWSBadge';

interface NotificationsViewProps {
  onNavigateToProject?: (projectId: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigateToProject }) => {
  const notifications = getNotifications();

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-h2 text-slate-800">Notifikasi</h2>
            <p className="text-sm text-slate-500 mt-1">Pemberitahuan otomatis sistem Early Warning</p>
          </div>
          <button className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            Tandai Semua Dibaca
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {notifications.map((notif) => (
            <NotificationCard key={notif.id} notification={notif} onNavigateToProject={onNavigateToProject} />
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-card border border-slate-100">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">Tidak ada notifikasi saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  onNavigateToProject?: (projectId: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onNavigateToProject }) => {
  const handleClick = () => {
    onNavigateToProject?.(notification.programId);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
      className={`group rounded-2xl shadow-card border p-5
        hover:shadow-pop transition-all duration-300 ease-in-out cursor-pointer hover:bg-slate-50
        ${notification.status === 'red'
          ? 'bg-rose-50/40 border-rose-100/80'
          : notification.status === 'amber'
            ? 'bg-amber-50/40 border-amber-100/80'
            : 'bg-white border-slate-100'
        }
        ${notification.read ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
          ${notification.status === 'red' ? 'bg-rose-50' : 'bg-amber-50'}`}>
          <Bell className={`w-5 h-5
            ${notification.status === 'red' ? 'text-rose-600' : 'text-amber-600'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800 line-clamp-1">
                {notification.programName}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">{notification.dinas}</p>
            </div>
            <div className="flex-shrink-0">
              <EWSBadge status={notification.status} variant="solid" size="sm" />
            </div>
          </div>

          <p className="mt-2 text-sm text-slate-600">{notification.message}</p>

          <div className="flex items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{notification.timestamp}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
