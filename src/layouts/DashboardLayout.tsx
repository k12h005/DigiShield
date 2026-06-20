import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Search,
  BarChart3,
  Gavel,
  FileText,
  Settings,
  Menu,
  Bell,
  User,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '../utils/cn';
import api from '../services/api';
import IntelStatus from '../components/IntelStatus';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { useI18n } from '../i18n';

const DashboardLayout: React.FC = () => {
  const { t } = useI18n();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingAlerts, setPendingAlerts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const sidebarItems = useMemo(() => [
    { icon: LayoutDashboard, label: t.nav.dashboard, path: '/dashboard' },
    { icon: Search, label: t.nav.monitoring, path: '/monitoring' },
    { icon: ShieldAlert, label: t.nav.alerts, path: '/alerts', badge: true },
    { icon: BarChart3, label: t.nav.analytics, path: '/analytics' },
    { icon: Gavel, label: t.nav.threatIntel, path: '/legal' },
    { icon: FileText, label: t.nav.reports, path: '/reports' },
  ], [t]);

  const user = useMemo(() => {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { firstName?: string; lastName?: string; role?: string; email?: string };
    } catch {
      return null;
    }
  }, [location]);

  const roleLabel: Record<string, string> = {
    individual: t.roles.individual,
    legal: t.roles.legal,
    government: t.roles.government,
    admin: t.roles.admin,
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get('/alerts');
        const pending = response.data.filter((a: { status: string }) => a.status === 'pending').length;
        setPendingAlerts(pending);
      } catch {
        setPendingAlerts(0);
      }
    };
    fetchAlerts();
  }, [location]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const NavContent = ({ collapsed }: { collapsed: boolean }) => (
    <>
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-border', collapsed && 'justify-center px-2')}>
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
          <ShieldAlert className="text-white w-5 h-5" />
        </div>
        {!collapsed && <span className="font-bold text-lg text-text tracking-tight">{t.app.name}</span>}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
        {sidebarItems.map((item) => {
          const active = location === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group',
                active
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-text-muted hover:bg-surface-muted hover:text-text',
                collapsed && 'justify-center px-2',
              )}
            >
              <item.icon className={cn('w-5 h-5 shrink-0', active ? 'text-white' : 'text-text-muted group-hover:text-text')} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              {item.badge && pendingAlerts > 0 && (
                <span className={cn(
                  'text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1',
                  collapsed ? 'absolute -top-1 -right-1' : 'ml-auto',
                )}>
                  {pendingAlerts > 9 ? '9+' : pendingAlerts}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1">
        {!collapsed && user && (
          <button
            type="button"
            onClick={() => { navigate('/settings'); setMobileOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-muted hover:bg-border/40 transition-colors mb-2 text-left"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {user.firstName?.[0] || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text truncate">
                {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'DigiShield User'}
              </p>
              <p className="text-xs text-text-muted truncate">{roleLabel[user.role || 'individual']}</p>
            </div>
          </button>
        )}
        <Link
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
            location === '/settings' ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-muted',
            collapsed && 'justify-center',
          )}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">{t.nav.settings}</span>}
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors',
            collapsed && 'justify-center',
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">{t.nav.signOut}</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-page flex overflow-x-hidden">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label={t.common.close}
        />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 bg-surface border-r border-border flex flex-col transition-all duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isSidebarOpen ? 'w-64' : 'w-[72px]',
        )}
        aria-label="Sidebar"
      >
        <NavContent collapsed={!isSidebarOpen} />
        <button
          type="button"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-surface border border-border rounded-full items-center justify-center shadow-sm hover:border-primary/40"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={cn('w-3.5 h-3.5 transition-transform', !isSidebarOpen && 'rotate-180')} />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 hover:bg-surface-muted rounded-lg shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0 overflow-hidden">
            <IntelStatus />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <LanguageSelector compact className="hidden sm:flex" />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => navigate('/alerts')}
              className="p-2.5 text-text-muted hover:text-text hover:bg-surface-muted rounded-xl relative transition-colors"
              aria-label={t.nav.alerts}
            >
              <Bell className="w-5 h-5" />
              {pendingAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface" />
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="p-2.5 text-text-muted hover:text-text hover:bg-surface-muted rounded-xl transition-colors"
              aria-label={t.nav.settings}
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
