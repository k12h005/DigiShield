import React from 'react';
import { User, Bell, Shield, Key, CreditCard, Trash2 } from 'lucide-react';

const Settings: React.FC = () => {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text">Settings</h1>
                <p className="text-text-muted mt-1">Manage your account preferences and security.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
                {/* Sidebar Nav */}
                <div className="space-y-1">
                    {[
                        { label: 'Profile', icon: User, active: true },
                        { label: 'Notifications', icon: Bell },
                        { label: 'Security', icon: Shield },
                        { label: 'API Access', icon: Key },
                        { label: 'Billing', icon: CreditCard },
                    ].map((item, i) => (
                        <button 
                            key={i} 
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                                item.active ? "bg-white text-primary shadow-sm" : "text-text-muted hover:bg-gray-100"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-6">
                    <div className="card">
                        <h3 className="font-bold text-lg text-text mb-6">Personal Information</h3>
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-bold text-text">First Name</label>
                                    <input type="text" defaultValue="John" className="input-field" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-bold text-text">Last Name</label>
                                    <input type="text" defaultValue="Doe" className="input-field" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text">Email Address</label>
                                <input type="email" defaultValue="john.doe@email.com" className="input-field disabled:bg-gray-50 text-text-muted" disabled />
                                <p className="text-xs text-text-muted">Email cannot be changed directly. Contact support for assistance.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text">Bio</label>
                                <textarea className="input-field h-24" defaultValue="Legal professional specializing in cyber law and identity protection."></textarea>
                            </div>
                            <div className="flex justify-end pt-4 border-t border-gray-50">
                                <button className="btn-primary">Save Changes</button>
                            </div>
                        </div>
                    </div>

                    <div className="card border-red-100">
                        <h3 className="font-bold text-lg text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-sm text-text-muted mb-6">Permanently delete your account and all associated monitoring data.</p>
                        <button className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100">
                            <Trash2 className="w-4 h-4" /> Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const cn = (...inputs: (string | boolean | undefined | null)[]) => inputs.filter(Boolean).join(' ');

export default Settings;
