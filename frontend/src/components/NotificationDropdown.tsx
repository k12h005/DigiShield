import React, { useRef, useEffect } from 'react';
import { Bell, AlertCircle, Info, CheckCircle, X } from 'lucide-react';
import { useApp, type Notification } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const severityIcon = (severity: Notification['severity']) => {
  switch (severity) {
    case 'High':   return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'Medium': return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case 'Low':    return <AlertCircle className="w-4 h-4 text-blue-500" />;
    default:       return <Info className="w-4 h-4 text-primary" />;
  }
};

const NotificationDropdown: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useApp();
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-96 rounded-2xl shadow-xl z-50 overflow-hidden animate-modal-in"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: 'var(--color-text)' }} />
          <span className="font-bold" style={{ color: 'var(--color-text)' }}>
            {t('notifications')}
          </span>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {t('mark_all_read')}
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y" style={{ '--tw-divide-opacity': '1' } as React.CSSProperties}>
        {notifications.length === 0 ? (
          <div
            className="py-12 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {t('no_notifications')}
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                'flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors',
                !n.read && 'bg-primary/[0.04]'
              )}
              style={{ borderBottom: '1px solid var(--color-border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-sub)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = !n.read ? 'rgba(249,115,22,0.04)' : '')}
            >
              <div className="mt-0.5 shrink-0">{severityIcon(n.severity)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
                  )}
                </div>
                <p
                  className="text-xs mt-0.5 leading-relaxed"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {n.message}
                </p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}>
                  {n.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <button
          onClick={onClose}
          className="text-xs font-semibold transition-colors w-full text-center flex items-center justify-center gap-1"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <X className="w-3 h-3" /> Close
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
