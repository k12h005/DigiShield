import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';
import { cn } from '../utils/cn';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Search, label: 'Asset Monitoring', path: '/monitoring' },
  { icon: ShieldAlert, label: 'Alerts', path: '/alerts' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Gavel, label: 'Legal Intelligence', path: '/legal' },
  { icon: FileText, label: 'Reports', path: '/reports' },
];

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldAlert className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-xl text-text tracking-tight">CyberGuard</span>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                location.pathname === item.path 
                  ? "bg-primary/10 text-primary" 
                  : "text-text-muted hover:bg-gray-100"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-primary" : "text-text-muted group-hover:text-text")} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-4 py-6 border-t border-gray-100 flex flex-col gap-1">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:bg-gray-100 transition-colors",
              location.pathname === '/settings' && "bg-primary/10 text-primary"
            )}
          >
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Settings</span>}
          </Link>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-4">
            <button className="p-2 text-text-muted hover:text-text relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-text">John Doe</p>
                <p className="text-xs text-text-muted">Legal Professional</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
