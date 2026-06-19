import React from 'react';
import { ExternalLink, ShieldCheck, Bookmark, Search, BookOpen, AlertTriangle } from 'lucide-react';

const LegalIntelligence: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text">Legal Intelligence</h1>
                    <p className="text-text-muted mt-1">Official advisories and compliance frameworks.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search advisories..." 
                        className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none w-full sm:w-64 shadow-sm" 
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* CERT-In Advisories */}
                <div className="lg:col-span-2 space-y-6">
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <AlertTriangle className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold text-text">Latest CERT-In Advisories</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: "CIAD-2024-0042: Vulnerabilities in Google Chrome", date: "Oct 15, 2024", id: "ADV-428" },
                                { title: "CIAD-2024-0039: Multiple Vulnerabilities in Microsoft Products", date: "Oct 11, 2024", id: "ADV-421" },
                                { title: "CIAD-2024-0035: Critical Vulnerability in Enterprise VPN", date: "Sep 28, 2024", id: "ADV-415" },
                            ].map((adv, i) => (
                                <div key={i} className="card p-5 group cursor-pointer hover:bg-secondary/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold text-primary font-mono">{adv.id}</span>
                                            <h3 className="font-bold text-text group-hover:text-primary transition-colors underline decoration-transparent group-hover:decoration-primary">{adv.title}</h3>
                                            <p className="text-sm text-text-muted">Impact: Remote Code Execution, Denial of Service</p>
                                        </div>
                                        <p className="text-xs font-bold text-text-muted uppercase">{adv.date}</p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-4">
                                        <button className="text-xs font-bold text-text-muted hover:text-text flex items-center gap-1">
                                            <ExternalLink className="w-3.5 h-3.5" /> Official Source
                                        </button>
                                        <button className="text-xs font-bold text-text-muted hover:text-text flex items-center gap-1">
                                            <Bookmark className="w-3.5 h-3.5" /> Save
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-100 rounded-xl text-sm font-bold text-text-muted hover:border-primary/50 hover:text-primary transition-all">
                            Load More Advisories
                        </button>
                    </section>
                </div>

                {/* Frameworks and Guides */}
                <div className="space-y-6">
                    <div className="card">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <h2 className="font-bold text-text">Compliance Guidance</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                "Digital Personal Data Protection Act (DPDP)",
                                "IT (Intermediary Guidelines) Rules",
                                "RBI Cybersecurity Framework",
                                "SEBI Guidelines for Fintech"
                            ].map((guide, i) => (
                                <a key={i} href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors group">
                                    <span className="text-sm font-semibold text-text group-hover:text-primary">{guide}</span>
                                    <ChevronRight className="w-4 h-4 text-text-muted" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="card bg-secondary/30 border-none">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                            <h2 className="font-bold text-text">Security Best Practices</h2>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { t: "Password Hygiene", d: "Rotate passwords every 90 days." },
                                { t: "Identity Lockdown", d: "Freeze credit reports if major breach occurs." },
                                { t: "Redressal Process", d: "How to file a cyber-complaint via 1930." }
                            ].map((item, i) => (
                                <li key={i}>
                                    <h4 className="text-sm font-bold text-text mb-1">{item.t}</h4>
                                    <p className="text-xs text-text-muted">{item.d}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal component mock
const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default LegalIntelligence;
