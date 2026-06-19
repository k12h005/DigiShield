import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../services/api';
import { cn } from '../utils/cn';

const chartData = [
  { name: 'Jan', breaches: 4 },
  { name: 'Feb', breaches: 3 },
  { name: 'Mar', breaches: 5 },
  { name: 'Apr', breaches: 8 },
  { name: 'May', breaches: 6 },
  { name: 'Jun', breaches: 12 },
];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          api.get('/analytics/stats'),
          api.get('/alerts')
        ]);

        const rawStats = statsRes.data;
        setStats([
          { label: 'Total Assets', value: rawStats.totalAssets, icon: Users, change: '+2', trend: 'up' },
          { label: 'Breaches Found', value: '12', icon: ShieldAlert, change: '+1', trend: 'up' },
          { label: 'Risk Score', value: rawStats.riskScore, icon: Activity, change: '-5', trend: 'down' },
          { label: 'Active Alerts', value: rawStats.totalAlerts, icon: AlertTriangle, change: '0', trend: 'neutral' },
        ]);

        setAlerts(alertsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Dashboard Overview</h1>
          <p className="text-text-muted mt-1">Here's what's happening with your digital security.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-5 h-5" /> Add Asset
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-secondary rounded-lg">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-sm font-bold",
                stat.trend === 'up' ? "text-red-500" : stat.trend === 'down' ? "text-green-500" : "text-gray-400"
              )}>
                {stat.change !== '0' && (stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />)}
                {stat.change}
              </div>
            </div>
            <p className="text-sm font-medium text-text-muted">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-text">Breach Trends</h3>
              <p className="text-sm text-text-muted">Visualizing data exposures over the last 6 months.</p>
            </div>
            <select className="bg-secondary border-none text-sm font-medium rounded-lg px-3 py-1.5 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBreaches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #F1F5F9', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="breaches" 
                  stroke="#F97316" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBreaches)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-text">Next Steps</h3>
          {[
            { title: "Enable 2FA", desc: "Add an extra layer of security to your email account.", action: "Setup Now" },
            { title: "Change Password", desc: "Your 'company.com' password was found in a 2024 breach.", action: "Update" },
            { title: "Review Domains", desc: "New domain assets suggested for monitoring.", action: "View" }
          ].map((rec, i) => (
            <div key={i} className="card p-5 group hover:border-primary/30 transition-all cursor-pointer">
              <h4 className="font-bold text-text mb-1 flex items-center justify-between">
                {rec.title}
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </h4>
              <p className="text-sm text-text-muted mb-4">{rec.desc}</p>
              <button className="text-sm font-bold text-primary">{rec.action}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text">Recent Alerts</h3>
          <button className="text-sm font-bold text-primary hover:underline">View All Alerts</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Asset</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {alerts.length > 0 ? alerts.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/100 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-text">{row.asset}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-muted">{row.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-bold leading-5",
                        row.severity === 'High' ? "bg-red-100 text-red-700" : 
                        row.severity === 'Medium' ? "bg-orange-100 text-orange-700" : 
                        "bg-blue-100 text-blue-700"
                    )}>
                      {row.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-bold leading-5",
                        row.status === 'pending' ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                    )}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-text-muted">No recent alerts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
