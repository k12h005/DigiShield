import React, { useEffect, useState } from 'react';
import { ExternalLink, ShieldCheck, Bookmark, Search, BookOpen, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../services/api';

interface Breach {
    Name: string;
    Title: string;
    Domain: string;
    BreachDate: string;
    Description: string;
    DataClasses: string[];
    PwnCount: number;
    LogoPath: string;
}

const LegalIntelligence: React.FC = () => {
    const [advisories, setAdvisories] = useState<Breach[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const filteredAdvisories = React.useMemo(() => {
        return advisories.filter(adv => 
            adv.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (adv.Domain && adv.Domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
            adv.Description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, advisories]);

    useEffect(() => {
        const fetchBreaches = async () => {
            try {
                const response = await api.get('/breaches');
                setAdvisories(response.data);
            } catch (err) {
                console.error('Failed to fetch breaches', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBreaches();
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text">Threat Intelligence Hub</h1>
                    <p className="text-text-muted mt-1">Global breach catalog and incident reports.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search breaches (e.g. Adobe)..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none w-full sm:w-64 shadow-sm" 
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Breach Catalog */}
                <div className="lg:col-span-2 space-y-6">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold text-text">Intelligence Records</h2>
                            </div>
                            <span className="text-sm font-bold text-text-muted">
                                {searchQuery ? `Showing ${filteredAdvisories.length} results` : `Total: ${advisories.length} records`}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {filteredAdvisories.length > 0 ? filteredAdvisories.slice(0, 50).map((adv) => (
                                <div key={adv.Name} className="card p-5 group cursor-pointer hover:bg-secondary/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold text-primary font-mono">{adv.Domain || 'General Breach'}</span>
                                            <h3 className="font-bold text-text group-hover:text-primary transition-colors underline decoration-transparent group-hover:decoration-primary">{adv.Title}</h3>
                                            <p className="text-sm text-text-muted leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: adv.Description }} />
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {adv.DataClasses.slice(0, 5).map((dc: string) => (
                                                    <span key={dc} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600">{dc}</span>
                                                ))}
                                                {adv.DataClasses.length > 5 && (
                                                    <span className="px-2 py-0.5 bg-gray-50 rounded text-[10px] font-bold text-gray-400">+{adv.DataClasses.length - 5} more</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right min-w-[100px]">
                                            <p className="text-xs font-bold text-text-muted uppercase mb-1">Breach Date</p>
                                            <p className="text-sm font-bold text-text">{new Date(adv.BreachDate).toLocaleDateString()}</p>
                                            <div className="mt-4">
                                                <p className="text-xs font-bold text-text-muted uppercase mb-1">Impact</p>
                                                <p className="text-sm font-black text-primary">{(adv.PwnCount / 1000000).toFixed(1)}M</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-4">
                                        <button className="text-xs font-bold text-text-muted hover:text-text flex items-center gap-1">
                                            <ExternalLink className="w-3.5 h-3.5" /> Investigation Details
                                        </button>
                                        <button className="text-xs font-bold text-text-muted hover:text-text flex items-center gap-1">
                                            <Bookmark className="w-3.5 h-3.5" /> Track Incident
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <Search className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                                    <p className="text-text-muted font-medium">No records matching "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                        {filteredAdvisories.length > 50 && (
                            <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-100 rounded-xl text-sm font-bold text-text-muted hover:border-primary/50 hover:text-primary transition-all">
                                Load More Records (Showing 50 of {filteredAdvisories.length})
                            </button>
                        )}
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
                                "CERT-In Cyber Guidelines 2024"
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
                            <h2 className="font-bold text-text">Security Intelligence</h2>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { t: "Active Monitoring", d: "Continuous scans against HIBP database." },
                                { t: "Identity Lockdown", d: "Real-time alerts for domain exposures." },
                                { t: "Risk Scoring", d: "Impact assessment based on DataClasses." }
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

const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default LegalIntelligence;
