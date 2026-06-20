import React, { useState } from 'react';
import { ChevronRight, AlertCircle, Info, ExternalLink, CheckCircle, Filter } from 'lucide-react';
import { useApp, type AlertItem } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

type FilterType = 'All' | 'High' | 'Medium' | 'Low' | 'pending' | 'resolved';

const Alerts: React.FC = () => {
  const { alerts, resolveAlert } = useApp();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notifSettings, setNotifSettings] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyReports: true,
  });

  const filtered: AlertItem[] = alerts.filter((a) => {
    if (filter === 'All') return true;
    if (filter === 'pending' || filter === 'resolved') return a.status === filter;
    return a.severity === filter;
  });

  const toggleNotif = (key: keyof typeof notifSettings) =>
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'All', label: t('filter_all') },
    { value: 'High', label: t('filter_high') },
    { value: 'Medium', label: t('filter_medium') },
    { value: 'Low', label: t('filter_low') },
    { value: 'pending', label: t('filter_pending') },
    { value: 'resolved', label: t('filter_resolved') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
          {t('alerts_title')}
        </h1>
        <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {t('alerts_subtitle')}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t('filter_all'), count: alerts.length, color: 'var(--color-text)' },
          { label: t('filter_high'), count: alerts.filter((a) => a.severity === 'High').length, color: '#EF4444' },
          { label: t('filter_pending'), count: alerts.filter((a) => a.status === 'pending').length, color: '#EAB308' },
          { label: t('filter_resolved'), count: alerts.filter((a) => a.status === 'resolved').length, color: '#22C55E' },
        ].map((s) => (
          <div key={s.label} className="card py-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
            <h3 className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.count}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Alerts list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
            {filterOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                  filter === f.value ? 'bg-primary text-white shadow-sm' : ''
                )}
                style={filter !== f.value ? {
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'transparent',
                } : undefined}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="card text-center py-16">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="font-semibold" style={{ color: 'var(--color-text)' }}>All clear for this filter</p>
            </div>
          ) : (
            filtered.map((alert) => (
              <div
                key={alert.id}
                className={cn('card p-0 overflow-hidden transition-all', alert.status === 'resolved' && 'opacity-70')}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'mt-1 w-10 h-10 rounded-xl flex items-center justify-center border shrink-0',
                        alert.severity === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-500'
                          : alert.severity === 'Medium' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                          : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                      )}>
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>{alert.source}</h3>
                          <span className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                            alert.severity === 'High' ? 'bg-red-500/10 text-red-500'
                              : alert.severity === 'Medium' ? 'bg-orange-500/10 text-orange-500'
                              : 'bg-blue-500/10 text-blue-500'
                          )}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
                          Impacted Asset:{' '}
                          <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{alert.asset}</span>
                        </p>
                        <p className={cn('text-sm leading-relaxed transition-all', expandedId !== alert.id && 'line-clamp-2')}
                          style={{ color: 'var(--color-text-muted)' }}>
                          {alert.description}
                        </p>
                        {alert.description.length > 80 && (
                          <button
                            onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
                            className="text-xs font-bold text-primary mt-1 hover:underline"
                          >
                            {expandedId === alert.id ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-right whitespace-nowrap shrink-0">
                      <p className="text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-muted)' }}>{alert.date}</p>
                      <span className={cn(
                        'text-xs font-bold px-2.5 py-1 rounded-full',
                        alert.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                      )}>
                        {alert.status === 'resolved' ? t('filter_resolved') : t('filter_pending')}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="px-6 py-3 flex items-center justify-between"
                  style={{ backgroundColor: 'var(--color-bg-sub)', borderTop: '1px solid var(--color-border)' }}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
                      className="text-sm font-bold text-primary flex items-center gap-1 transition-colors hover:text-primary-hover"
                    >
                      {t('view_details')} <ChevronRight className="w-4 h-4" />
                    </button>
                    {alert.status === 'pending' && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="text-sm font-bold flex items-center gap-1 transition-colors hover:text-green-500"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <CheckCircle className="w-4 h-4" /> {t('mark_resolved')}
                      </button>
                    )}
                  </div>
                  <button
                    className="p-1.5 rounded transition-colors"
                    onClick={() => window.open('https://haveibeenpwned.com', '_blank')}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-card)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                  >
                    <ExternalLink className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card bg-primary text-white border-none">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5" />
              <h3 className="font-bold">Understanding Severity</h3>
            </div>
            <ul className="space-y-4 text-sm">
              {[
                { dot: 'bg-red-400', title: 'High', desc: 'Sensitive data like passwords or financial info exposed.' },
                { dot: 'bg-orange-300', title: 'Medium', desc: 'Emails and phone numbers exposed. Risk of phishing.' },
                { dot: 'bg-blue-300', title: 'Low', desc: 'Non-sensitive metadata or public domain info leaked.' },
              ].map((s) => (
                <li key={s.title} className="flex gap-3">
                  <span className={cn('block w-2.5 h-2.5 rounded-full mt-1 shrink-0', s.dot)} />
                  <span><strong className="block mb-0.5">{s.title}</strong>{s.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4" style={{ color: 'var(--color-text)' }}>{t('notification_prefs')}</h3>
            <div className="space-y-4">
              {([
                { key: 'emailAlerts' as const, label: t('email_alerts') },
                { key: 'pushNotifications' as const, label: t('push_notifications') },
                { key: 'weeklyReports' as const, label: t('weekly_reports') },
              ]).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{label}</span>
                  <button
                    onClick={() => toggleNotif(key)}
                    className={cn('w-10 h-5 rounded-full relative transition-colors', notifSettings[key] ? 'bg-primary' : '')}
                    style={!notifSettings[key] ? { backgroundColor: 'var(--color-border)' } : undefined}
                    role="switch" aria-checked={notifSettings[key]}
                  >
                    <div className={cn('w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all', notifSettings[key] ? 'right-0.5' : 'left-0.5')} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
