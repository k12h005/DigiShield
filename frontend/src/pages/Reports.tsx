import React from 'react';
import { FileText, Download, Clock, Calendar, CheckSquare, Plus } from 'lucide-react';

const Reports: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text">Reports & Exports</h1>
                    <p className="text-text-muted mt-1">Generate and download detailed security audits.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Generate New Report
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Reports', count: '12', icon: FileText },
                    { label: 'Scheduled', count: '2', icon: Calendar },
                    { label: 'Avg Severity', count: 'Mid', icon: Clock },
                    { label: 'Actions Taken', count: '84%', icon: CheckSquare },
                ].map((s, i) => (
                    <div key={i} className="card">
                        <div className="p-2 w-fit bg-secondary rounded-lg mb-4">
                            <s.icon className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{s.label}</p>
                        <h3 className="text-2xl font-bold text-text mt-1">{s.count}</h3>
                    </div>
                ))}
            </div>

            <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h3 className="font-bold text-text">Recent Reports</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Report Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Format</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: 'Quarterly Security Audit - Q3 2024', type: 'Full Audit', date: 'Oct 01, 2024', format: 'PDF' },
                                { name: 'Domain Exposure Summary', type: 'Asset Check', date: 'Sep 15, 2024', format: 'CSV' },
                                { name: 'Identity Risk Assessment', type: 'Risk Analysis', date: 'Aug 22, 2024', format: 'PDF' },
                                { name: 'Monthly Breach Intelligence', type: 'Briefing', date: 'Aug 05, 2024', format: 'PDF' },
                            ].map((report, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-gray-400" />
                                            <span className="font-bold text-text">{report.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{report.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{report.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600">{report.format}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button className="text-primary hover:text-primary-hover font-bold text-sm flex items-center gap-1 justify-end ml-auto">
                                            <Download className="w-4 h-4" /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
