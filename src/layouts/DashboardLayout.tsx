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

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Search, label: 'Asset Monitoring', path: '/monitoring' },
  { icon: ShieldAlert, label: 'Alerts', path: '/alerts', badge: true },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Gavel, label: 'Threat Intel', path: '/legal' },
  { icon: FileText, label: 'Reports', path: '/reports' },
];

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingAlerts, setPendingAlerts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation().pathname;

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
    individual: 'Citizen',
    legal: 'Legal Professional',
    government: 'Government Official',
    admin: 'Administrator',
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
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-gray-100', collapsed && 'justify-center px-2')}>
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
          <ShieldAlert className="text-white w-5 h-5" />
        </div>
        {!collapsed && <span className="font-bold text-lg text-text tracking-tight">DigiShield</span>}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const active = location === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group',
                active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-text-muted hover:bg-gray-100 hover:text-text',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className={cn('w-5 h-5 shrink-0', active ? 'text-white' : 'text-text-muted group-hover:text-text')} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              {item.badge && pendingAlerts > 0 && (
                <span className={cn(
                  'text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1',
                  collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'
                )}>
                  {pendingAlerts > 9 ? '9+' : pendingAlerts}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        {!collapsed && user && (
          <button
            onClick={() => { navigate('/settings'); setMobileOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors mb-2 text-left"
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
            location === '/settings' ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-gray-100',
            collapsed && 'justify-center'
          )}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Settings</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex">
      {mobileOpen && (
        <button className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
      )}

      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        isSidebarOpen ? 'w-64' : 'w-[72px]'
      )}>
        <NavContent collapsed={!isSidebarOpen} />
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm hover:border-primary/40"
        >
          <ChevronLeft className={cn('w-3.5 h-3.5 transition-transform', !isSidebarOpen && 'rotate-180')} />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <IntelStatus />

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/alerts')}
              className="p-2.5 text-text-muted hover:text-text hover:bg-gray-100 rounded-xl relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              {pendingAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2.5 text-text-muted hover:text-text hover:bg-gray-100 rounded-xl transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
