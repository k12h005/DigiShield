import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldAlert,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../services/api';
import { cn } from '../utils/cn';
import AddAssetModal from '../components/AddAssetModal';

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

interface AlertItem {
  id: string;
  asset: string;
  source: string;
  severity: string;
  date: string;
  status: string;
  exposedDataTypes?: string[];
  recommendations?: string[];
}

interface NextStep {
  title: string;
  desc: string;
  action: string;
  onClick: () => void;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [trendData, setTrendData] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
    try {
      const [statsRes, alertsRes, analyticsRes] = await Promise.all([
        api.get('/breaches/dashboard'),
        api.get('/alerts'),
        api.get('/breaches/analytics'),
      ]);

      const rawStats = statsRes.data;
      const alertList = alertsRes.data;
      setStats([
        { label: 'Intelligence Records', value: rawStats.totalIntelligenceRecords, icon: Users, change: 'Live', trend: 'neutral' },
        { label: 'Impact Estimate', value: `${(rawStats.globalImpactEstimate / 1000000).toFixed(0)}M`, icon: ShieldAlert, change: 'Global', trend: 'up' },
        { label: 'Critical Threats', value: rawStats.criticalAlertsActive, icon: Activity, change: 'Catalog', trend: 'down' },
        { label: 'Your Active Alerts', value: alertList.filter((a: AlertItem) => a.status === 'pending').length, icon: AlertTriangle, change: `${alertList.length} total`, trend: 'neutral' },
      ]);
      setAlerts(alertList);
      setTrendData(analyticsRes.data.monthlyTrend?.length ? analyticsRes.data.monthlyTrend : []);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const nextSteps = useMemo<NextStep[]>(() => {
    const steps: NextStep[] = [];
    const pending = alerts.filter((a) => a.status === 'pending');
    const passwordAlert = pending.find((a) =>
      a.exposedDataTypes?.some((d) => d.toLowerCase().includes('password'))
    );
    const highSeverity = pending.find((a) => a.severity === 'Critical' || a.severity === 'High');

    if (passwordAlert) {
      steps.push({
        title: 'Change Password',
        desc: `Password exposure detected via ${passwordAlert.source}. Update credentials immediately.`,
        action: 'View Alert',
        onClick: () => navigate('/alerts'),
      });
    }

    if (highSeverity) {
      steps.push({
        title: 'Review Exposed Domains',
        desc: `${highSeverity.asset} matched a ${highSeverity.severity.toLowerCase()} severity breach.`,
        action: 'Review Now',
        onClick: () => navigate('/monitoring'),
      });
    }

    steps.push({
      title: 'Enable 2FA',
      desc: 'Add an extra layer of security to your account in Settings.',
      action: 'Setup Now',
      onClick: () => navigate('/settings'),
    });

    if (pending.length === 0) {
      steps.unshift({
        title: 'Add Your First Asset',
        desc: 'Monitor a domain like adobe.com to see live breach intelligence in action.',
        action: 'Add Asset',
        onClick: () => setShowAddAsset(true),
      });
    }

    return steps.slice(0, 3);
  }, [alerts, navigate]);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Dashboard Overview</h1>
          <p className="text-text-muted mt-1">Your security posture based on live breach intelligence.</p>
        </div>
        <button onClick={() => setShowAddAsset(true)} className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-5 h-5" /> Add Asset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-text-muted">{stat.change}</span>
            </div>
            <p className="text-sm font-medium text-text-muted">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-text">Breach Intelligence Trend</h3>
              <p className="text-sm text-text-muted">Verified incidents by month from HIBP corpus.</p>
            </div>
          </div>
          <div className="h-[280px] w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorBreaches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #F1F5F9' }} />
                  <Area type="monotone" dataKey="count" stroke="#F97316" strokeWidth={2} fill="url(#colorBreaches)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-text-muted text-sm">Trend data loading from intelligence feed...</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-text">Recommended Actions</h3>
          {nextSteps.map((rec) => (
            <button
              key={rec.title}
              onClick={rec.onClick}
              className="card p-5 w-full text-left group hover:border-primary/30 transition-all"
            >
              <h4 className="font-bold text-text mb-1 flex items-center justify-between">
                {rec.title}
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all" />
              </h4>
              <p className="text-sm text-text-muted mb-3">{rec.desc}</p>
              <span className="text-sm font-bold text-primary">{rec.action}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text">Recent Alerts</h3>
          <Link to="/alerts" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            View All Alerts <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-3 text-left text-xs font-bold text-text-muted uppercase">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-text-muted uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-text-muted uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-text-muted uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-text-muted uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {alerts.slice(0, 5).map((row) => (
                <tr key={row.id} onClick={() => navigate('/alerts')} className="hover:bg-gray-50/80 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-text">{row.asset}</td>
                  <td className="px-6 py-4 text-text-muted">{row.source}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'px-2.5 py-0.5 rounded-full text-xs font-bold',
                      row.severity === 'Critical' || row.severity === 'High' ? 'bg-red-100 text-red-700' :
                      row.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    )}>
                      {row.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">{row.date}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={cn(
                      'px-2.5 py-0.5 rounded-full text-xs font-bold capitalize',
                      row.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    )}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                    No alerts yet. <button onClick={() => setShowAddAsset(true)} className="text-primary font-bold hover:underline">Add a domain</button> to start monitoring.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddAssetModal
        open={showAddAsset}
        onClose={() => setShowAddAsset(false)}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
};

export default Dashboard;
