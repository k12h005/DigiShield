import React from 'react';
import { 
    LineChart, Line, 
    BarChart, Bar, 
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const breachData = [
    { name: 'Jul', count: 1 },
    { name: 'Aug', count: 4 },
    { name: 'Sep', count: 2 },
    { name: 'Oct', count: 8 },
    { name: 'Nov', count: 5 },
    { name: 'Dec', count: 12 },
];

const exposedData = [
    { name: 'Email', value: 45, fill: '#F97316' },
    { name: 'Passwords', value: 25, fill: '#FCA5A5' },
    { name: 'Phone', value: 15, fill: '#94A3B8' },
    { name: 'Address', value: 10, fill: '#E2E8F0' },
    { name: 'Gov ID', value: 5, fill: '#1F2937' },
];

const riskData = [
    { name: 'High', value: 3 },
    { name: 'Medium', value: 7 },
    { name: 'Low', value: 14 },
];

const COLORS = ['#EF4444', '#F97316', '#3B82F6'];

const Analytics: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text">Intelligent Analytics</h1>
                <p className="text-text-muted mt-1">Gaining deeper insights into your cyber footprint.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Breaches Over Time */}
                <div className="card">
                    <h3 className="font-bold text-text mb-6">Breaches Over Time</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={breachData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
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
                    <h3 className="font-bold text-text mb-6">Most Common Data Exposed</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={exposedData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#1F2937', fontWeight: 600, fontSize: 12}} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Distribution */}
                <div className="card">
                    <h3 className="font-bold text-text mb-6">Risk Distribution</h3>
                    <div className="h-[300px] flex items-center">
                        <div className="flex-1 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={riskData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {riskData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-4 pr-10">
                            {riskData.map((d, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                        <span className="text-sm font-semibold text-text">{d.name} Risk</span>
                                    </div>
                                    <span className="text-sm font-bold text-text-muted">{d.value} assets</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="card bg-secondary/50 border-dashed border-2 flex flex-col justify-center p-8">
                   <h3 className="font-bold text-text mb-4">Analytics Insights</h3>
                   <div className="space-y-4">
                      <p className="text-text-muted leading-relaxed">
                         <strong className="text-text">Email Exposure:</strong> 45% of your breaches include email address leaks. Recommendation: Use aliases or hardware security keys.
                      </p>
                      <p className="text-text-muted leading-relaxed">
                         <strong className="text-text">Peak Period:</strong> Breach activity for your monitored assets peaked in December 2024.
                      </p>
                   </div>
                   <button className="mt-8 btn-primary self-start">Download Summary Report</button>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
