import React, { useState } from 'react';
import {
  Users, ShieldAlert, Activity, AlertTriangle,
  ArrowUpRight, ArrowDownRight, ArrowRight, CheckCircle2,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

const CHART_DATA: Record<string, { name: string; breaches: number }[]> = {
  '30d': [
    { name: 'Week 1', breaches: 2 }, { name: 'Week 2', breaches: 5 },
    { name: 'Week 3', breaches: 3 }, { name: 'Week 4', breaches: 7 },
  ],
  '6m': [
    { name: 'Jan', breaches: 4 }, { name: 'Feb', breaches: 3 },
    { name: 'Mar', breaches: 5 }, { name: 'Apr', breaches: 8 },
    { name: 'May', breaches: 6 }, { name: 'Jun', breaches: 12 },
  ],
  '12m': [
    { name: 'Jan', breaches: 2 }, { name: 'Feb', breaches: 4 },
    { name: 'Mar', breaches: 3 }, { name: 'Apr', breaches: 7 },
    { name: 'May', breaches: 5 }, { name: 'Jun', breaches: 9 },
    { name: 'Jul', breaches: 6 }, { name: 'Aug', breaches: 11 },
    { name: 'Sep', breaches: 8 }, { name: 'Oct', breaches: 14 },
    { name: 'Nov', breaches: 10 }, { name: 'Dec', breaches: 18 },
  ],
};

const Dashboard: React.FC = () => {
  const { alerts, assets, nextSteps, completeNextStep, enableTwoFactor } = useApp();
  const { t } = useLanguage();
  const [chartRange, setChartRange] = useState<'30d' | '6m' | '12m'>('6m');
  const navigate = useNavigate();

  const totalIntelligenceRecords = 4820 + assets.length * 3;
  const globalImpactEstimate = (1.24 + assets.length * 0.02).toFixed(2);
  const criticalAlerts = alerts.filter((a) => a.severity === 'High' && a.status === 'pending').length;
  const activeAlerts = alerts.filter((a) => a.status === 'pending').length;

  const stats = [
    { label: t('stat_intelligence_records'), value: totalIntelligenceRecords.toLocaleString(), icon: Users, change: '+5', trend: 'up' as const },
    { label: t('stat_impact_estimate'), value: `${globalImpactEstimate}M`, icon: ShieldAlert, change: '+12%', trend: 'up' as const },
    { label: t('stat_critical_threats'), value: criticalAlerts, icon: Activity, change: criticalAlerts > 0 ? 'ACTIVE' : 'CLEAR', trend: criticalAlerts > 0 ? 'down' as const : 'neutral' as const },
    { label: t('stat_active_alerts'), value: activeAlerts, icon: AlertTriangle, change: activeAlerts > 0 ? `${activeAlerts} open` : 'All clear', trend: 'neutral' as const },
  ];

  const rangeOptions = [
    { value: '30d', label: t('range_30d') },
    { value: '6m', label: t('range_6m') },
    { value: '12m', label: t('range_12m') },
  ];

  const stepMeta = [
    { title: t('step_2fa_title'), desc: t('step_2fa_desc'), action: t('step_2fa_action'), type: 'settings' },
    { title: t('step_pw_title'), desc: t('step_pw_desc'), action: t('step_pw_action'), type: 'password' },
    { title: t('step_domain_title'), desc: t('step_domain_desc'), action: t('step_domain_action'), type: 'domain' },
  ];

  const handleNextStepAction = (id: number, type: string) => {
    if (type === 'settings') enableTwoFactor();
    else if (type === 'password') navigate('/settings');
    else if (type === 'domain') navigate('/monitoring');
    completeNextStep(id);
  };

  const recentAlerts = [...alerts].sort((a, b) =>
    a.status === 'pending' ? -1 : b.status === 'pending' ? 1 : 0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
          {t('dashboard_title')}
        </h1>
        <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {t('dashboard_subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--color-bg-sub)' }}>
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className={cn(
                'text-xs font-bold px-2 py-1 rounded-full',
                stat.trend === 'up' ? 'bg-red-500/10 text-red-500'
                  : stat.trend === 'down' ? 'bg-green-500/10 text-green-500'
                  : 'text-text-muted'
              )}
                style={stat.trend === 'neutral' ? { backgroundColor: 'var(--color-bg-sub)', color: 'var(--color-text-muted)' } : undefined}
              >
                {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 inline -mt-0.5" />}
                {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3 inline -mt-0.5" />}
                {' '}{stat.change}
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--color-text)' }}>
              {stat.value}
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                {t('breach_trends')}
              </h3>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {t('breach_trends_subtitle')}
              </p>
            </div>
            <select
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value as typeof chartRange)}
              className="text-sm font-semibold rounded-lg px-3 py-1.5 outline-none cursor-pointer shrink-0 border"
              style={{
                backgroundColor: 'var(--color-bg-sub)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              {rangeOptions.map((o) => (
                <option key={o.value} value={o.value} style={{ backgroundColor: 'var(--color-bg-card)' }}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA[chartRange]}>
                <defs>
                  <linearGradient id="colorBreaches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    color: 'var(--color-text)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                  labelStyle={{ fontWeight: 700, color: 'var(--color-text)' }}
                />
                <Area type="monotone" dataKey="breaches" stroke="#F97316" strokeWidth={2.5}
                  fillOpacity={1} fill="url(#colorBreaches)"
                  dot={{ r: 3, fill: '#F97316', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#F97316' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
            {t('next_steps')}
          </h3>
          <AnimatePresence mode="popLayout">
            {nextSteps.map((step, idx) => {
              const meta = stepMeta[idx] ?? { title: step.title, desc: step.desc, action: step.action, type: step.type };
              return (
                <motion.div
                  key={step.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn('card p-5 group transition-all', step.completed ? 'opacity-60' : 'cursor-pointer')}
                  style={step.completed ? { backgroundColor: 'var(--color-bg-sub)' } : undefined}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                      {step.completed && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                      {meta.title}
                    </h4>
                    {!step.completed && (
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{meta.desc}</p>
                  {step.completed ? (
                    <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
                      {t('completed')}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleNextStepAction(step.id, step.type)}
                      className="text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                    >
                      {meta.action}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="card overflow-hidden p-0">
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
            {t('recent_alerts')}
          </h3>
          <button onClick={() => navigate('/alerts')} className="text-sm font-bold text-primary hover:text-primary-hover transition-colors">
            {t('view_all_alerts')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-sub)' }}>
                {['Asset', 'Source', 'Severity', 'Date', 'Status'].map((h, i) => (
                  <th key={h} className={cn(
                    'px-6 py-4 text-xs font-bold uppercase tracking-wider',
                    i === 4 ? 'text-right' : 'text-left'
                  )} style={{ color: 'var(--color-text-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentAlerts.length > 0 ? recentAlerts.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer transition-colors"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-row-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                  onClick={() => navigate('/alerts')}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium" style={{ color: 'var(--color-text)' }}>{row.asset}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--color-text-muted)' }}>{row.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold',
                      row.severity === 'High' ? 'bg-red-500/10 text-red-500'
                        : row.severity === 'Medium' ? 'bg-orange-500/10 text-orange-500'
                        : 'bg-blue-500/10 text-blue-500'
                    )}>
                      {row.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--color-text-muted)' }}>{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold',
                      row.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                    )}>
                      {row.status === 'pending' ? t('filter_pending') : t('filter_resolved')}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    {t('no_alerts')}
                  </td>
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
