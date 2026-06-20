import React, { useEffect, useState } from 'react';
import { 
    LineChart, Line, 
    BarChart, Bar, 
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../services/api';
import { useI18n } from '../i18n';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#EF4444', '#F97316', '#3B82F6', '#94A3B8'];

interface DataPoint {
    name: string;
    value: number;
}

interface TrendPoint {
    name: string;
    count: number;
}

interface AnalyticsData {
    mostCommonData: DataPoint[];
    severityDistribution: DataPoint[];
    totalBreaches: number;
    totalPwnCount: number;
    monthlyTrend?: TrendPoint[];
}

const Analytics: React.FC = () => {
    const { t } = useI18n();
    const { theme } = useTheme();
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [certAnalytics, setCertAnalytics] = useState<{
        totalAdvisories: number;
        criticalCount: number;
        highCount: number;
        categoryDistribution: DataPoint[];
        monthlyTrend: TrendPoint[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    const gridStroke = theme === 'dark' ? '#334155' : '#F1F5F9';
    const tickFill = theme === 'dark' ? '#94A3B8' : '#94A3B8';
    const labelFill = theme === 'dark' ? '#F1F5F9' : '#1F2937';

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [breachRes, certRes] = await Promise.all([
                    api.get('/breaches/analytics'),
                    api.get('/intelligence/cert-advisories/analytics'),
                ]);
                setAnalytics(breachRes.data);
                setCertAnalytics(certRes.data);
            } catch (err) {
                console.error('Failed to fetch analytics', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="card text-center py-20 text-text-muted">
                Unable to load analytics. Start the Python backend and sync breach intelligence first.
            </div>
        );
    }

    const breachTrendData = analytics.monthlyTrend?.length
        ? analytics.monthlyTrend
        : [{ name: 'N/A', count: 0 }];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text">{t.analytics.title}</h1>
                <p className="text-text-muted mt-1">{t.analytics.subtitle}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Breaches Over Time */}
                <div className="card">
                    <h3 className="font-bold text-text mb-6">Breach Intelligence Trends</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={breachTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: tickFill, fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: tickFill, fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="count" stroke="#F97316" strokeWidth={3} dot={{ r: 4, fill: '#F97316' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Most Common Data Exposed */}
                <div className="card">
                    <h3 className="font-bold text-text mb-6">Risk Factor Distribution (Data Types)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.mostCommonData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: labelFill, fontWeight: 600, fontSize: 11}} width={120} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#F97316" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Distribution */}
                <div className="card">
                    <h3 className="font-bold text-text mb-6">Intelligence Severity Distribution</h3>
                    <div className="h-[300px] flex items-center">
                        <div className="flex-1 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics.severityDistribution}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {analytics.severityDistribution.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-4 pr-10">
                            {analytics.severityDistribution.map((d, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                        <span className="text-sm font-semibold text-text">{d.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-text-muted">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="card bg-secondary/50 border-dashed border-2 flex flex-col justify-center p-8">
                   <h3 className="font-bold text-text mb-4">Threat Intelligence Summary</h3>
                   <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                         <strong className="text-text">Total Recorded Breaches:</strong> {analytics.totalBreaches} verified incidents.
                      </p>
                      <p className="text-text-muted leading-relaxed">
                         <strong className="text-text">Global Impact:</strong> Approximately {(analytics.totalPwnCount / 1000000).toFixed(0)} million accounts exposed across the catalog.
                      </p>
                   </div>
                   <Link to="/legal" className="mt-8 btn-primary self-start inline-flex">
                     Explore Threat Intelligence Hub
                   </Link>
                </div>
            </div>

            {certAnalytics && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-text">{t.analytics.certTitle}</h2>
                        <p className="text-sm text-text-muted">{t.analytics.certSubtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Advisories', value: certAnalytics.totalAdvisories },
                            { label: 'Critical', value: certAnalytics.criticalCount },
                            { label: 'High', value: certAnalytics.highCount },
                        ].map((stat) => (
                            <div key={stat.label} className="card py-5">
                                <p className="text-xs font-bold text-text-muted uppercase">{stat.label}</p>
                                <p className="text-3xl font-black text-primary mt-1">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="card">
                            <h3 className="font-bold text-text mb-6">CERT Advisory Categories</h3>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={certAnalytics.categoryDistribution.slice(0, 8)}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickFill, fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: tickFill, fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="card">
                            <h3 className="font-bold text-text mb-6">CERT Advisory Trend</h3>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={certAnalytics.monthlyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickFill, fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: tickFill, fontSize: 12 }} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#FB923C" strokeWidth={2} dot={{ r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
