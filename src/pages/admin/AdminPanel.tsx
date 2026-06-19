import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ShieldCheck, Users, Database, LayoutDashboard, Search, Key, LogOut } from 'lucide-react';

const AdminPanel: React.FC = () => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    if (!isAdminAuthenticated) {
        return <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-[#1F2937] text-white flex flex-col">
                <div className="p-6 flex items-center gap-3 bg-[#111827]">
                    <ShieldCheck className="text-primary w-6 h-6" />
                    <span className="font-bold text-lg">Admin Console</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {[
                        { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
                        { label: 'User Management', icon: Users, path: '/admin/users' },
                        { label: 'Breach Database', icon: Database, path: '/admin/breaches' },
                        { label: 'System Logs', icon: Search, path: '/admin/logs' },
                        { label: 'Access Control', icon: Key, path: '/admin/access' },
                    ].map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-gray-300 hover:text-white"
                        >
                            <item.icon className="w-5 h-5 text-gray-400" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-700">
                   <button 
                    onClick={() => setIsAdminAuthenticated(false)}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-white transition-colors"
                   >
                       <LogOut className="w-5 h-5" /> Sign Out
                   </button>
                </div>
            </aside>

            {/* Admin Content */}
            <main className="flex-1 p-10 overflow-auto">
                <Routes>
                    <Route index element={<AdminOverview />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="*" element={<div className="text-center py-20 text-text-muted">Feature under development.</div>} />
                </Routes>
            </main>
        </div>
    );
};

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-[#1F2937] rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="text-primary w-10 h-10" />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-text mb-2">Admin Portal</h1>
            <p className="text-center text-text-muted mb-8 text-sm">Restricted access area. Please enter your credentials.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Admin Username</label>
                    <input type="text" className="input-field" placeholder="admin_user_01" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-text">Security Key</label>
                    <input type="password" className="input-field" placeholder="••••••••••••" required />
                </div>
                <button type="submit" className="w-full bg-[#1F2937] text-white font-bold py-3 rounded-lg hover:bg-[#111827] transition-colors">
                    Access Console
                </button>
            </form>
        </div>
    </div>
);

const AdminOverview = () => (
    <div className="space-y-8">
        <h1 className="text-4xl font-bold text-text">Platform Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-text-muted font-bold uppercase text-xs tracking-widest mb-4">Metric {i}</h3>
                    <p className="text-3xl font-extrabold text-text">145,20{i}</p>
                </div>
            ))}
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-96 flex items-center justify-center italic text-text-muted">
            Global Activity Feed Placeholder
        </div>
    </div>
);

const UserManagement = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-text">User Management</h1>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold">Export Users</button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 italic text-text-muted text-sm">
                    <tr><td colSpan={4} className="px-6 py-20 text-center">Admin database connection established. Displaying mock user list...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default AdminPanel;
