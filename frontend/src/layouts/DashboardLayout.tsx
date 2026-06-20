import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Search,
  BarChart3,
  Gavel,
  FileText,
  Settings,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Plus,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import NotificationDropdown from '../components/NotificationDropdown';
import ProfileMenu from '../components/ProfileMenu';
import AddAssetModal from '../components/AddAssetModal';
import { ThemeToggle, LanguageToggle } from '../components/ThemeLanguageToggle';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount, openAddAssetModal, user } = useApp();
  const { t } = useLanguage();

  const sidebarItems = [
    { icon: LayoutDashboard, label: t('nav_dashboard'), path: '/dashboard' },
    { icon: Search, label: t('nav_asset_monitoring'), path: '/monitoring' },
    { icon: ShieldAlert, label: t('nav_alerts'), path: '/alerts' },
    { icon: BarChart3, label: t('nav_analytics'), path: '/analytics' },
    { icon: Gavel, label: t('nav_legal_intelligence'), path: '/legal' },
    { icon: FileText, label: t('nav_reports'), path: '/reports' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Sidebar */}
      <aside
        className={cn(
          'transition-all duration-300 flex flex-col shrink-0 sidebar',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div
          className="p-5 flex items-center gap-3"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <ShieldAlert className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && (
            <span
              className="font-bold text-xl tracking-tight"
              style={{ color: 'var(--color-text)' }}
            >
              CyberGuard
            </span>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {sidebarItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={!isSidebarOpen ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
                  active
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'hover:bg-white/5'
                )}
                style={!active ? { color: 'var(--color-text-muted)' } : undefined}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 shrink-0',
                    active ? 'text-primary' : ''
                  )}
                />
                {isSidebarOpen && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div
          className="px-3 py-4 flex flex-col gap-0.5"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <Link
            to="/settings"
            title={!isSidebarOpen ? t('nav_settings') : undefined}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
              location.pathname === '/settings'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-white/5'
            )}
            style={
              location.pathname !== '/settings'
                ? { color: 'var(--color-text-muted)' }
                : undefined
            }
          >
            <Settings className="w-5 h-5 shrink-0" />
            {isSidebarOpen && (
              <span className="text-sm font-medium">{t('nav_settings')}</span>
            )}
          </Link>
          <button
            onClick={handleLogout}
            title={!isSidebarOpen ? t('nav_sign_out') : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && (
              <span className="text-sm font-medium">{t('nav_sign_out')}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-5 sticky top-0 z-40 top-header"
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={openAddAssetModal}
              className="btn-primary flex items-center gap-2 text-sm py-2"
            >
              <Plus className="w-4 h-4" />
              {t('add_asset')}
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            {/* Language toggle */}
            <LanguageToggle />

            {/* Divider */}
            <div
              className="h-6 w-px mx-1"
              style={{ backgroundColor: 'var(--color-border)' }}
            />

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Divider */}
            <div
              className="h-6 w-px mx-1"
              style={{ backgroundColor: 'var(--color-border)' }}
            />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
                className={cn(
                  'p-2 rounded-lg transition-colors relative',
                  notifOpen
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-white/5'
                )}
                style={{ color: notifOpen ? undefined : 'var(--color-text-muted)' }}
                aria-label={t('notifications')}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-[var(--color-header)]" />
                )}
              </button>
              <NotificationDropdown
                isOpen={notifOpen}
                onClose={() => setNotifOpen(false)}
              />
            </div>

            {/* Divider */}
            <div
              className="h-6 w-px mx-1"
              style={{ backgroundColor: 'var(--color-border)' }}
            />

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-colors',
                  profileOpen ? 'bg-white/5' : 'hover:bg-white/5'
                )}
              >
                <div className="text-right hidden sm:block">
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {user.firstName} {user.lastName}
                  </p>
                  <p
                    className="text-xs leading-tight"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {user.role}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              </button>
              <ProfileMenu
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Modal */}
      <AddAssetModal />
    </div>
  );
};

export default DashboardLayout;
