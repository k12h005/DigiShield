import React from 'react';
import { ChevronRight, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';

const Alerts: React.FC = () => {
    const alerts = [
        { 
            id: 1, 
            asset: 'john.doe@email.com', 
            source: 'LinkedIn 2024 Breach', 
            severity: 'High', 
            date: 'Oct 12, 2024', 
            status: 'Pending',
            description: 'Your email address and job title were found in a large dataset leaked from LinkedIn. The data appears to be from early 2024.'
        },
        { 
            id: 2, 
            asset: '+91 9876543210', 
            source: 'Telecom Provider Leak', 
            severity: 'Medium', 
            date: 'Oct 08, 2024', 
            status: 'Resolved',
            description: 'Customer contact details from a major telecom provider were exposed online.'
        },
        { 
            id: 3, 
            asset: 'company.gov', 
            source: 'Data Aggregator Leak', 
            severity: 'Low', 
            date: 'Sep 24, 2024', 
            status: 'Pending',
            description: 'Publicly available domain information was found in an insecure MongoDB database.'
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text">Security Alerts</h1>
                <p className="text-text-muted mt-1">Real-time notifications about your data exposures.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Alerts List */}
                <div className="lg:col-span-2 space-y-4">
                    {alerts.map((alert) => (
                        <div key={alert.id} className="card p-0 overflow-hidden group hover:border-primary/20 transition-all">
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "mt-1 w-10 h-10 rounded-lg flex items-center justify-center border",
                                            alert.severity === 'High' ? "bg-red-50 border-red-100 text-red-600" :
                                            alert.severity === 'Medium' ? "bg-orange-50 border-orange-100 text-orange-600" :
                                            "bg-blue-50 border-blue-100 text-blue-600"
                                        )}>
                                            <AlertCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-lg text-text">{alert.source}</h3>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                                    alert.severity === 'High' ? "bg-red-100 text-red-700" : 
                                                    alert.severity === 'Medium' ? "bg-orange-100 text-orange-700" : 
                                                    "bg-blue-100 text-blue-700"
                                                )}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-text-muted mb-2">Impacted Asset: <span className="text-text">{alert.asset}</span></p>
                                            <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">{alert.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right whitespace-nowrap">
                                        <p className="text-sm font-semibold text-text-muted mb-1">{alert.date}</p>
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-0.5 rounded-full",
                                            alert.status === 'Resolved' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                        )}>
                                            {alert.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-secondary/50 px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button className="text-sm font-bold text-text-muted hover:text-text flex items-center gap-1 transition-colors">
                                        Mark as Resolved
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-1.5 hover:bg-white rounded transition-colors" title="External Link">
                                        <ExternalLink className="w-4 h-4 text-text-muted" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="card bg-primary text-white border-none">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="w-6 h-6" />
                            <h3 className="font-bold text-lg">Understanding Severity</h3>
                        </div>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="flex gap-3">
                                <span className="block w-2.5 h-2.5 rounded-full bg-red-400 mt-1 shrink-0"></span>
                                <span><strong className="block mb-1">High Severity</strong> Sensitive data like passwords, financial info, or full identity records exposed. Urgent action required.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="block w-2.5 h-2.5 rounded-full bg-orange-400 mt-1 shrink-0"></span>
                                <span><strong className="block mb-1">Medium Severity</strong> Emails and phone numbers exposed. Risk of phishing and spam. Action recommended.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="block w-2.5 h-2.5 rounded-full bg-blue-400 mt-1 shrink-0"></span>
                                <span><strong className="block mb-1">Low Severity</strong> Non-sensitive metadata or public domain info leaked. Monitor for changes.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="card">
                        <h3 className="font-bold text-text mb-4">Notification Settings</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Email Alerts', enabled: true },
                                { label: 'Push Notifications', enabled: false },
                                { label: 'Weekly Reports', enabled: true },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-text">{s.label}</span>
                                    <div className={cn(
                                        "w-10 h-5 rounded-full relative transition-colors cursor-pointer",
                                        s.enabled ? "bg-primary" : "bg-gray-200"
                                    )}>
                                        <div className={cn(
                                            "w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all",
                                            s.enabled ? "right-0.5" : "left-0.5"
                                        )}></div>
                                    </div>
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
