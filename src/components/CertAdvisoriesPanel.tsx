import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2, Search, Shield } from 'lucide-react';
import api from '../services/api';
import { cn } from '../utils/cn';
import { useI18n } from '../i18n';

interface CertAdvisory {
  id: number;
  title: string;
  severity: string;
  category: string;
  affectedSystems: string[];
  recommendation: string;
  date: string;
  reference: string;
}

const severityClass = (severity: string) => {
  if (severity === 'Critical' || severity === 'High') return 'severity-critical';
  if (severity === 'Medium') return 'severity-medium';
  return 'severity-low';
};

const CertAdvisoriesPanel: React.FC = () => {
  const { t } = useI18n();
  const [items, setItems] = useState<CertAdvisory[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('');
  const [visible, setVisible] = useState(15);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/intelligence/cert-advisories', {
          params: { search, severity: severity || undefined, limit: 300 },
        });
        setItems(res.data.items);
        setTotal(res.data.total);
      } catch {
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [search, severity]);

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category))].sort(),
    [items],
  );

  if (loading && items.length === 0) {
    return (
      <div className="card flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {t.threatIntel.certTitle}
          </h2>
          <p className="text-sm text-text-muted">{t.threatIntel.certSubtitle}</p>
        </div>
        <span className="text-xs font-mono text-text-muted">{total} {t.common.records}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${t.common.search} CERT-DS...`}
            className="input-field pl-10"
            aria-label="Search advisories"
          />
        </div>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="input-field sm:max-w-[160px]"
          aria-label="Filter by severity"
        >
          <option value="">{t.common.filter}: All</option>
          {['Critical', 'High', 'Medium', 'Low'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 6).map((cat) => (
          <span key={cat} className="text-[10px] font-bold px-2 py-1 rounded-full bg-surface-muted text-text-muted border border-border">
            {cat}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {items.slice(0, visible).map((adv) => (
          <article key={adv.id} className="card p-4 sm:p-5 hover:border-primary/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-primary">{adv.reference}</span>
                  <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full', severityClass(adv.severity))}>
                    {adv.severity}
                  </span>
                  <span className="text-[10px] text-text-muted">{adv.date}</span>
                </div>
                <h3 className="font-bold text-text">{adv.title}</h3>
                <p className="text-xs font-semibold text-text-muted mt-1">{adv.category}</p>
                <p className="text-sm text-text-muted mt-2 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {adv.recommendation}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {adv.affectedSystems.map((sys) => (
                    <span key={sys} className="px-2 py-0.5 bg-surface-muted rounded text-[10px] font-semibold text-text-muted border border-border">
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {visible < items.length && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + 15)}
          className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm font-bold text-text-muted hover:border-primary/40 hover:text-primary transition-all"
        >
          {t.common.loadMore} ({visible} / {items.length})
        </button>
      )}

      {items.length === 0 && !loading && (
        <div className="card text-center py-12 text-text-muted">{t.common.noData}</div>
      )}
    </div>
  );
};

export default CertAdvisoriesPanel;
