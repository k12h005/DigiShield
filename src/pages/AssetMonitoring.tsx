import React, { useState } from 'react';
import { Mail, Smartphone, Globe, Plus, Search, MoreVertical, Trash2, ShieldCheck, Filter } from 'lucide-react';
import { cn } from '../utils/cn';

const AssetMonitoring: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');

    const assets = [
        { id: 1, type: 'email', value: 'john.doe@gmail.com', status: 'Monitored', date: 'Oct 12, 2023', breaches: 3 },
        { id: 2, type: 'phone', value: '+91 9876543210', status: 'Monitored', date: 'Jan 05, 2024', breaches: 1 },
        { id: 3, type: 'domain', value: 'mybusiness.in', status: 'Verifying', date: 'Oct 10, 2024', breaches: 0 },
        { id: 4, type: 'email', value: 'work.john@company.com', status: 'Monitored', date: 'Mar 22, 2024', breaches: 8 },
    ];

    const stats = [
        { label: 'Emails', count: 12, icon: Mail },
        { label: 'Phones', count: 4, icon: Smartphone },
        { label: 'Domains', count: 2, icon: Globe },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text">Asset Monitoring</h1>
                    <p className="text-text-muted mt-1">Manage and track your digital assets for potential exposures.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Add New Asset
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="card flex items-center gap-5">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <s.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-muted">{s.label}</p>
                            <h3 className="text-2xl font-bold text-text">{s.count}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Assets Table */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex bg-secondary p-1 rounded-lg w-fit">
                        {['all', 'emails', 'phones', 'domains'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-semibold rounded-md transition-all capitalize",
                                    activeTab === tab ? "bg-white text-text shadow-sm" : "text-text-muted hover:text-text"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search assets..." 
                            className="bg-secondary border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none w-full sm:w-64" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Asset Details</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Added On</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Total Breaches</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {assets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                {asset.type === 'email' ? <Mail className="w-4 h-4 text-gray-500" /> : 
                                                 asset.type === 'phone' ? <Smartphone className="w-4 h-4 text-gray-500" /> : 
                                                 <Globe className="w-4 h-4 text-gray-500" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text">{asset.value}</p>
                                                <p className="text-xs text-text-muted capitalize">{asset.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className={cn("w-2 h-2 rounded-full", asset.status === 'Monitored' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse')}></div>
                                            <span className="font-medium text-text">{asset.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{asset.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-text">
                                        {asset.breaches > 0 ? (
                                            <span className="text-red-500 flex items-center gap-1">
                                                <ShieldCheck className="w-4 h-4" /> {asset.breaches}
                                            </span>
                                        ) : '0'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-text-muted hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-text-muted">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                    <p className="text-sm text-text-muted">Showing 4 of 18 assets</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded bg-white text-sm disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded bg-white text-sm">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetMonitoring;
