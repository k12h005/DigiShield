import React, { useEffect, useState } from 'react';
import { ChevronRight, AlertCircle, Info, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import api from '../services/api';

interface LegalGuidance {
    framework: string;
    guidance: string;
}

interface AlertItem {
    id: string;
    asset: string;
    source: string;
    severity: string;
    date: string;
    status: string;
    description?: string;
    exposedDataTypes: string[];
    recommendations: string[];
    legalGuidance: LegalGuidance[];
}

const Alerts: React.FC = () => {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchAlerts = async () => {
        try {
            const response = await api.get('/alerts');
            setAlerts(response.data);
        } catch (err) {
            console.error('Failed to fetch alerts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const resolveAlert = async (id: string) => {
        try {
            const response = await api.patch(`/alerts/${id}`, { status: 'resolved' });
            setAlerts((prev) => prev.map((alert) => (alert.id === id ? response.data : alert)));
        } catch (err) {
            console.error('Failed to update alert', err);
        }
    };

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text">Security Alerts</h1>
                <p className="text-text-muted mt-1">Real-time notifications about domain and organizational exposure.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {alerts.length > 0 ? alerts.map((alert) => (
                        <div key={alert.id} className="card p-0 overflow-hidden group hover:border-primary/20 transition-all">
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "mt-1 w-10 h-10 rounded-lg flex items-center justify-center border",
                                            alert.severity === 'Critical' || alert.severity === 'High' ? "bg-red-50 border-red-100 text-red-600" :
                                            alert.severity === 'Medium' ? "bg-orange-50 border-orange-100 text-orange-600" :
                                            "bg-blue-50 border-blue-100 text-blue-600"
                                        )}>
                                            <AlertCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h3 className="font-bold text-lg text-text">{alert.source}</h3>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                                    alert.severity === 'Critical' || alert.severity === 'High' ? "bg-red-100 text-red-700" :
                                                    alert.severity === 'Medium' ? "bg-orange-100 text-orange-700" :
                                                    "bg-blue-100 text-blue-700"
                                                )}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-text-muted mb-2">
                                                Impacted Asset: <span className="text-text">{alert.asset}</span>
                                            </p>
                                            <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                                                {alert.description?.replace(/<[^>]*>/g, '') || 'Exposure detected in verified breach intelligence corpus.'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right whitespace-nowrap">
                                        <p className="text-sm font-semibold text-text-muted mb-1">{alert.date}</p>
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-0.5 rounded-full capitalize",
                                            alert.status === 'resolved' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                        )}>
                                            {alert.status}
                                        </span>
                                    </div>
                                </div>

                                {expandedId === alert.id && (
                                    <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-text mb-2">Exposed Data Types</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {alert.exposedDataTypes.map((item) => (
                                                    <span key={item} className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-700">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-text mb-2">Recommended Actions</h4>
                                            <ul className="space-y-2">
                                                {alert.recommendations.map((rec) => (
                                                    <li key={rec} className="text-sm text-text-muted flex gap-2">
                                                        <span className="text-primary">✓</span> {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {alert.legalGuidance?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-bold text-text mb-2">Legal Guidance</h4>
                                                <div className="space-y-3">
                                                    {alert.legalGuidance.map((item) => (
                                                        <div key={item.framework} className="bg-secondary/60 rounded-lg p-3">
                                                            <p className="text-xs font-bold text-primary mb-1">{item.framework}</p>
                                                            <p className="text-sm text-text-muted">{item.guidance}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="bg-secondary/50 px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
                                        className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
                                    >
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </button>
                                    {alert.status !== 'resolved' && (
                                        <button
                                            onClick={() => resolveAlert(alert.id)}
                                            className="text-sm font-bold text-text-muted hover:text-text flex items-center gap-1 transition-colors"
                                        >
                                            Mark as Resolved
                                        </button>
                                    )}
                                </div>
                                <button className="p-1.5 hover:bg-white rounded transition-colors" title="External Link">
                                    <ExternalLink className="w-4 h-4 text-text-muted" />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="card text-center py-16">
                            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-text-muted font-medium">No alerts yet.</p>
                            <p className="text-sm text-text-muted mt-2">Add a monitored domain like <strong>adobe.com</strong> to generate live breach alerts.</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="card bg-primary text-white border-none">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="w-6 h-6" />
                            <h3 className="font-bold text-lg">Understanding Severity</h3>
                        </div>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="flex gap-3">
                                <span className="block w-2.5 h-2.5 rounded-full bg-red-400 mt-1 shrink-0"></span>
                                <span><strong className="block mb-1">Critical / High</strong> Passwords, financial data, or identity records exposed. Urgent action required.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="block w-2.5 h-2.5 rounded-full bg-orange-400 mt-1 shrink-0"></span>
                                <span><strong className="block mb-1">Medium</strong> Emails and phone numbers exposed. Phishing risk elevated.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="block w-2.5 h-2.5 rounded-full bg-blue-400 mt-1 shrink-0"></span>
                                <span><strong className="block mb-1">Low</strong> Limited metadata exposure. Continue monitoring.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alerts;
