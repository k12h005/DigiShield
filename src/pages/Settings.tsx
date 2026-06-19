import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Bell, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { cn } from '../utils/cn';
import { getUserPrefs, saveUserPrefs, updateStoredUser } from '../utils/userPrefs';

type Tab = 'profile' | 'notifications' | 'security';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ id: '', firstName: '', lastName: '', email: '', role: '' });
  const [prefs, setPrefs] = useState(getUserPrefs(''));

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/auth/profile');
        setProfile(response.data);
        setPrefs(getUserPrefs(response.data.id));
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const response = await api.patch('/auth/profile', {
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      updateStoredUser(response.data);
      saveUserPrefs(profile.id, prefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
    { id: 'security' as Tab, label: 'Security', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Account Settings</h1>
        <p className="text-text-muted mt-1">Manage your profile, alerts, and security preferences.</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <div className="card p-3 h-fit space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                activeTab === tab.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-text-muted hover:bg-gray-50'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === 'profile' && (
            <div className="card">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                  {profile.firstName?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text">{profile.firstName} {profile.lastName}</h3>
                  <p className="text-sm text-text-muted">{profile.email}</p>
                  <span className="inline-block mt-2 text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-gray-100 text-text-muted">
                    {profile.role}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-text">First Name</label>
                    <input
                      className="input-field mt-1"
                      value={profile.firstName || ''}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-text">Last Name</label>
                    <input
                      className="input-field mt-1"
                      value={profile.lastName || ''}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-text">Email</label>
                  <input className="input-field mt-1 bg-gray-50 text-text-muted" value={profile.email} disabled />
                  <p className="text-xs text-text-muted mt-1">Email is tied to your account identity and cannot be changed here.</p>
                </div>
                <div>
                  <label className="text-sm font-bold text-text">Professional Bio</label>
                  <textarea
                    className="input-field mt-1 h-24 resize-none"
                    placeholder="Describe your role in legal or government cyber operations..."
                    value={prefs.bio}
                    onChange={(e) => setPrefs({ ...prefs, bio: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card space-y-4">
              <h3 className="font-bold text-lg text-text mb-2">Alert Preferences</h3>
              {[
                { key: 'emailAlerts' as const, label: 'Email Alerts', desc: 'Receive breach notifications by email.' },
                { key: 'pushNotifications' as const, label: 'In-App Notifications', desc: 'Show real-time alerts inside DigiShield.' },
                { key: 'weeklyReports' as const, label: 'Weekly Intelligence Report', desc: 'Summary of new breaches affecting your assets.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div>
                    <p className="font-semibold text-text">{item.label}</p>
                    <p className="text-sm text-text-muted">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setPrefs({ ...prefs, [item.key]: !prefs[item.key] })}
                    className={cn(
                      'w-12 h-7 rounded-full relative transition-colors',
                      prefs[item.key] ? 'bg-primary' : 'bg-gray-300'
                    )}
                  >
                    <span className={cn(
                      'absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all',
                      prefs[item.key] ? 'left-[22px]' : 'left-0.5'
                    )} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card space-y-4">
              <h3 className="font-bold text-lg text-text">Security Controls</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="font-semibold text-text">Two-Factor Authentication</p>
                  <p className="text-sm text-text-muted">Recommended for legal and government accounts.</p>
                </div>
                <button
                  onClick={() => setPrefs({ ...prefs, twoFactorEnabled: !prefs.twoFactorEnabled })}
                  className={cn('px-4 py-2 rounded-lg text-sm font-bold transition-colors',
                    prefs.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-text-muted'
                  )}
                >
                  {prefs.twoFactorEnabled ? 'Enabled' : 'Enable'}
                </button>
              </div>
              <Link to="/monitoring" className="inline-flex text-sm font-bold text-primary hover:underline">
                Review monitored assets →
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between">
            {saved && (
              <span className="flex items-center gap-2 text-sm font-semibold text-green-600">
                <CheckCircle2 className="w-4 h-4" /> Changes saved
              </span>
            )}
            <button onClick={handleSave} disabled={saving} className="btn-primary ml-auto px-6 py-2.5">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
