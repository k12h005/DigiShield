import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Key, CreditCard, Trash2, Save, CheckCircle, Lock, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

const Settings: React.FC = () => {
  const { settingsTab, setSettingsTab, user, updateUser, enableTwoFactor } = useApp();
  const { t } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({ firstName: user.firstName, lastName: user.lastName, bio: user.bio });
  const [notifPrefs, setNotifPrefs] = useState({ emailAlerts: true, pushNotifications: false, weeklyReports: true, breachAlerts: true });
  const [passwordData, setPasswordData] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    setFormData({ firstName: user.firstName, lastName: user.lastName, bio: user.bio });
  }, [user]);

  const tabs = [
    { label: t('tab_profile'), icon: User },
    { label: t('tab_notifications'), icon: Bell },
    { label: t('tab_security'), icon: Shield },
    { label: t('tab_api_access'), icon: Key },
    { label: t('tab_billing'), icon: CreditCard },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (passwordData.next.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (passwordData.next !== passwordData.confirm) { setPwError('Passwords do not match.'); return; }
    setPwSuccess(true);
    setPasswordData({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwSuccess(false), 3000);
  };

  const activeTabLabel = tabs[tabs.findIndex((x) =>
    x.label === settingsTab || x.label === t(`tab_${settingsTab.toLowerCase()}` as Parameters<typeof t>[0])
  )]?.label ?? tabs[0].label;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{t('settings_title')}</h1>
        <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('settings_subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-0.5">
          {tabs.map((item) => (
            <button key={item.label} onClick={() => setSettingsTab(item.label)}
              className={cn('w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                activeTabLabel === item.label ? 'text-primary' : ''
              )}
              style={activeTabLabel === item.label
                ? { backgroundColor: 'var(--color-bg-card)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }
                : { color: 'var(--color-text-muted)', backgroundColor: 'transparent' }
              }
              onMouseEnter={(e) => { if (activeTabLabel !== item.label) e.currentTarget.style.backgroundColor = 'var(--color-bg-card)'; }}
              onMouseLeave={(e) => { if (activeTabLabel !== item.label) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">

          {/* Profile */}
          {activeTabLabel === tabs[0].label && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="card">
                <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--color-text)' }}>{t('personal_information')}</h3>
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row gap-5">
                    {[{ label: t('first_name'), key: 'firstName' as const }, { label: t('last_name'), key: 'lastName' as const }].map(({ label, key }) => (
                      <div key={key} className="space-y-1.5 flex-1">
                        <label className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{label}</label>
                        <input type="text" value={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className="input-field" required />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{t('email_address')}</label>
                    <input type="email" defaultValue={user.email} className="input-field opacity-60 cursor-not-allowed" disabled />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{t('bio')}</label>
                    <textarea className="input-field h-24 resize-none" value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
                  </div>
                  <div className="flex justify-end pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <button type="submit"
                      className={cn('flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all',
                        saved ? 'bg-green-500 text-white' : 'btn-primary')}>
                      {saved ? <><CheckCircle className="w-4 h-4" /> {t('saved')}</> : <><Save className="w-4 h-4" /> {t('save_changes')}</>}
                    </button>
                  </div>
                </div>
              </div>
              <div className="card" style={{ borderColor: '#EF444430' }}>
                <h3 className="font-bold text-red-500 mb-1">{t('danger_zone')}</h3>
                <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>Permanently delete your account and all associated monitoring data.</p>
                <button type="button" className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors border border-red-500/20">
                  <Trash2 className="w-4 h-4" /> {t('delete_account')}
                </button>
              </div>
            </form>
          )}

          {/* Notifications */}
          {activeTabLabel === tabs[1].label && (
            <div className="card space-y-5">
              <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>{t('tab_notifications')}</h3>
              {([
                { key: 'emailAlerts' as const, label: t('email_alerts'), desc: 'Receive email when new breaches are detected.' },
                { key: 'pushNotifications' as const, label: t('push_notifications'), desc: 'Browser push alerts for critical events.' },
                { key: 'weeklyReports' as const, label: t('weekly_reports'), desc: 'Digest of your security posture every Monday.' },
                { key: 'breachAlerts' as const, label: 'Breach Updates', desc: 'New global breach records as they are added.' },
              ]).map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
                  </div>
                  <button onClick={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))}
                    className={cn('w-11 h-6 rounded-full relative transition-colors shrink-0', notifPrefs[key] ? 'bg-primary' : '')}
                    style={!notifPrefs[key] ? { backgroundColor: 'var(--color-border)' } : undefined}
                    role="switch" aria-checked={notifPrefs[key]}>
                    <div className={cn('w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all', notifPrefs[key] ? 'right-0.5' : 'left-0.5')} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Security */}
          {activeTabLabel === tabs[2].label && (
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>{t('two_factor')}</h3>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t('two_factor_desc')}</p>
                  </div>
                  {user.twoFactorEnabled ? (
                    <span className="shrink-0 flex items-center gap-1.5 bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" /> {t('enabled')}
                    </span>
                  ) : (
                    <button onClick={enableTwoFactor} className="shrink-0 btn-primary text-sm py-2">{t('enable_2fa')}</button>
                  )}
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-2 mb-5">
                  <Lock className="w-5 h-5 text-primary" />
                  <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>{t('change_password')}</h3>
                </div>
                {pwSuccess && (
                  <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Password updated successfully.
                  </div>
                )}
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {[
                    { label: t('current_password'), key: 'current' as const },
                    { label: t('new_password'), key: 'next' as const },
                    { label: t('confirm_password'), key: 'confirm' as const },
                  ].map(({ label, key }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{label}</label>
                      <input type="password" value={passwordData[key]}
                        onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })}
                        className={cn('input-field', pwError && key !== 'current' && 'border-red-500')}
                        placeholder="••••••••" required />
                    </div>
                  ))}
                  {pwError && <p className="text-xs font-medium text-red-500">{pwError}</p>}
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="btn-primary text-sm py-2.5 px-5">{t('update_password')}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* API Access */}
          {activeTabLabel === tabs[3].label && (
            <div className="card space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>{t('tab_api_access')}</h3>
              </div>
              <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-sub)' }}>
                <p className="text-sm font-bold mb-2" style={{ color: 'var(--color-text)' }}>Your API Key</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 font-mono text-sm truncate px-4 py-2.5 rounded-lg border"
                    style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                    cg_live_••••••••••••••••••••••••••••••••
                  </code>
                  <button className="btn-primary text-sm py-2.5 shrink-0">Reveal</button>
                </div>
              </div>
              <button className="text-sm font-bold text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors border border-red-500/20">
                Regenerate API Key
              </button>
            </div>
          )}

          {/* Billing */}
          {activeTabLabel === tabs[4].label && (
            <div className="card space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>{t('tab_billing')}</h3>
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold" style={{ color: 'var(--color-text)' }}>Pro Plan</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>$29/month · Renews Dec 1, 2024</p>
                </div>
                <span className="bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1 rounded-full">Active</span>
              </div>
              {['50 monitored assets', 'Real-time breach alerts', 'Full legal intelligence hub', 'Monthly security reports', 'Priority support'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />{f}
                </div>
              ))}
              <button className="btn-primary text-sm py-2.5 px-5">Manage Subscription</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
