import React, { useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  Search,
  BookOpen,
  AlertTriangle,
  Loader2,
  Plus,
  ChevronRight,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import IntelResyncButton from '../components/IntelResyncButton';
import CertAdvisoriesPanel from '../components/CertAdvisoriesPanel';
import { useI18n } from '../i18n';
import { cn } from '../utils/cn';

interface Breach {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate?: string;
  Description: string;
  DataClasses: string[];
  PwnCount: number;
  LogoPath?: string;
  IsVerified?: boolean;
}

interface LegalItem {
  framework: string;
  guidance: string;
}

const LegalIntelligence: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hibp' | 'cert'>('hibp');
  const [records, setRecords] = useState<Breach[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [selected, setSelected] = useState<Breach | null>(null);
  const [tracking, setTracking] = useState<string | null>(null);
  const [legalGuidance, setLegalGuidance] = useState<LegalItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await api.get('/breaches/recent?limit=100');
      setRecords(response.data);
    } catch (err) {
      console.error('Failed to fetch breaches', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [refreshKey]);

  useEffect(() => {
    if (selected?.DataClasses?.length) {
      api.get('/intelligence/legal', { params: { dataClasses: selected.DataClasses.join(',') } })
        .then((res) => setLegalGuidance(res.data))
        .catch(() => setLegalGuidance([]));
    }
  }, [selected]);

  const filtered = useMemo(() => {
    return records.filter((adv) =>
      adv.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.Domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.Description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, records]);

  const handleTrackDomain = async (domain: string, name: string) => {
    if (!domain) return;
    setTracking(name);
    try {
      await api.post('/assets', { type: 'domain', value: domain });
      navigate('/monitoring');
    } catch (err) {
      console.error('Track failed', err);
      alert('Could not add domain — it may already be monitored.');
    } finally {
      setTracking(null);
    }
  };

  if (loading && records.length === 0) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">{t.threatIntel.title}</h1>
          <p className="text-text-muted mt-1 text-sm font-mono">{t.threatIntel.subtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {activeTab === 'hibp' && <IntelResyncButton onDone={() => setRefreshKey((k) => k + 1)} />}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              placeholder={t.threatIntel.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
              disabled={activeTab === 'cert'}
            />
          </div>
        </div>
      </div>

      <div className="flex bg-surface-muted p-1 rounded-xl w-full sm:w-fit border border-border">
        {(['hibp', 'cert'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg transition-all',
              activeTab === tab ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text',
            )}
          >
            {tab === 'hibp' ? 'HIBP Breaches' : 'CERT-In Advisories'}
          </button>
        ))}
      </div>

      {activeTab === 'cert' ? (
        <CertAdvisoriesPanel />
      ) : (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-text">{t.threatIntel.latestRecords}</h2>
            </div>
            <span className="text-xs font-mono text-text-muted">
              {filtered.length} records
            </span>
          </div>

          {filtered.slice(0, visibleCount).map((adv) => (
            <div key={adv.Name} className="card p-5 hover:border-primary/20 transition-all">
              <div className="flex gap-4">
                {adv.LogoPath ? (
                  <img src={adv.LogoPath} alt="" className="w-12 h-12 rounded-xl object-contain bg-gray-50 border border-gray-100 shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary font-mono">{adv.Domain || 'general'}</span>
                    {adv.IsVerified && (
                      <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Verified</span>
                    )}
                    {adv.AddedDate && (
                      <span className="text-[10px] text-text-muted">Added {new Date(adv.AddedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-text text-lg">{adv.Title}</h3>
                  <p className="text-sm text-text-muted line-clamp-2 mt-1" dangerouslySetInnerHTML={{ __html: adv.Description }} />
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {adv.DataClasses?.slice(0, 4).map((dc) => (
                      <span key={dc} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600">{dc}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => setSelected(adv)}
                      className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
                    >
                      Investigation Details <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    {adv.Domain && (
                      <button
                        disabled={tracking === adv.Name}
                        onClick={() => handleTrackDomain(adv.Domain, adv.Name)}
                        className="text-xs font-bold text-text-muted hover:text-text flex items-center gap-1 disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {tracking === adv.Name ? 'Adding...' : 'Monitor Domain'}
                      </button>
                    )}
                    <a
                      href={`https://haveibeenpwned.com/PwnedWebsites#${adv.Name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-text-muted hover:text-text flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> HIBP Source
                    </a>
                  </div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-[10px] font-bold text-text-muted uppercase">Impact</p>
                  <p className="text-lg font-black text-primary">{(adv.PwnCount / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-text-muted mt-2">{new Date(adv.BreachDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="card text-center py-16 text-text-muted">No records match your search.</div>
          )}

          {visibleCount < filtered.length && (
            <button
              onClick={() => setVisibleCount((c) => c + 12)}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-text-muted hover:border-primary/40 hover:text-primary transition-all"
            >
              Load More ({visibleCount} of {filtered.length})
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-text">{t.threatIntel.compliance}</h2>
            </div>
            <div className="space-y-3">
              {[
                'Digital Personal Data Protection Act (DPDP)',
                'CERT-In Cyber Guidelines 2024',
                'IT Act 2000 — Section 43A',
                'RBI Cybersecurity Framework',
              ].map((guide) => (
                <button
                  key={guide}
                  onClick={() => navigate('/alerts')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                >
                  <span className="text-sm font-semibold text-text group-hover:text-primary">{guide}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                </button>
              ))}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary/5 to-orange-50 dark:from-primary/10 dark:to-surface border-primary/10">
            <ShieldCheck className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold text-text mb-2">How to demo live data</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Click <strong>Monitor Domain</strong> on any record, then check Alerts for instant exposure matches against your assets.
            </p>
          </div>
        </div>
      </div>
      )}

      {selected && activeTab === 'hibp' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-primary uppercase">{selected.Domain}</p>
                <h2 className="text-2xl font-bold text-text mt-1">{selected.Title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-text-muted mb-6" dangerouslySetInnerHTML={{ __html: selected.Description }} />
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-text-muted uppercase">Records Exposed</p>
                <p className="text-2xl font-black text-primary">{(selected.PwnCount / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-text-muted uppercase">Breach Date</p>
                <p className="text-lg font-bold text-text">{new Date(selected.BreachDate).toLocaleDateString()}</p>
              </div>
            </div>
            {legalGuidance.length > 0 && (
              <div className="space-y-3 mb-6">
                <h4 className="font-bold text-text">Legal Guidance</h4>
                {legalGuidance.map((item) => (
                  <div key={item.framework} className="bg-secondary/60 rounded-xl p-3">
                    <p className="text-xs font-bold text-primary">{item.framework}</p>
                    <p className="text-sm text-text-muted mt-1">{item.guidance}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              {selected.Domain && (
                <button
                  onClick={() => { handleTrackDomain(selected.Domain, selected.Name); setSelected(null); }}
                  className="btn-primary flex-1"
                >
                  Monitor This Domain
                </button>
              )}
              <a
                href={`https://haveibeenpwned.com/PwnedWebsites#${selected.Name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 border border-gray-200 rounded-lg font-semibold text-text hover:bg-gray-50"
              >
                View on HIBP
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalIntelligence;
