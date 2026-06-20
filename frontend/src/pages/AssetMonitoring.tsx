import React, { useState } from 'react';
import {
  Mail, Smartphone, Globe, Plus, Search,
  MoreVertical, Trash2, ShieldCheck, Filter, AlertTriangle,
} from 'lucide-react';
import { useApp, type Asset, type AssetType } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

type Tab = 'all' | AssetType;
const PAGE_SIZE = 8;

const AssetMonitoring: React.FC = () => {
  const { assets, removeAsset, openAddAssetModal } = useApp();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = assets.filter((a) => {
    const matchTab = activeTab === 'all' || a.type === activeTab;
    const matchSearch = search.trim() === '' || a.value.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = [
    { label: t('tab_emails'), count: assets.filter((a) => a.type === 'email').length, icon: Mail, tab: 'email' as Tab },
    { label: t('tab_phones'), count: assets.filter((a) => a.type === 'phone').length, icon: Smartphone, tab: 'phone' as Tab },
    { label: t('tab_domains'), count: assets.filter((a) => a.type === 'domain').length, icon: Globe, tab: 'domain' as Tab },
  ];

  const typeIcon = (type: AssetType) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />;
      case 'phone': return <Smartphone className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />;
      case 'domain': return <Globe className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />;
    }
  };

  const handleDelete = (id: number) => {
    if (confirmDelete === id) { removeAsset(id); setConfirmDelete(null); }
    else { setConfirmDelete(id); setTimeout(() => setConfirmDelete(null), 3000); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{t('assets_title')}</h1>
          <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('assets_subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)', backgroundColor: 'var(--color-bg-card)' }}>
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button onClick={openAddAssetModal} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> {t('add_new_asset')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s) => (
          <button key={s.label} onClick={() => { setActiveTab(s.tab); setPage(1); }}
            className="card flex items-center gap-5 text-left transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{s.count}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex p-1 rounded-xl w-fit gap-0.5" style={{ backgroundColor: 'var(--color-bg-sub)' }}>
            {([
              { tab: 'all' as Tab, label: t('tab_all') },
              { tab: 'email' as Tab, label: t('tab_emails') },
              { tab: 'phone' as Tab, label: t('tab_phones') },
              { tab: 'domain' as Tab, label: t('tab_domains') },
            ]).map(({ tab, label }) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
                className={cn('px-4 py-1.5 text-xs font-bold rounded-lg transition-all')}
                style={activeTab === tab
                  ? { backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text)', boxShadow: 'var(--shadow-card)' }
                  : { color: 'var(--color-text-muted)' }}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-primary transition-colors"
              style={{ color: 'var(--color-text-muted)' }} />
            <input type="text" placeholder={t('search_assets')} value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="rounded-xl pl-10 pr-4 py-2 text-sm outline-none w-full sm:w-56 focus:ring-2 focus:ring-primary/20 border"
              style={{ backgroundColor: 'var(--color-bg-sub)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-sub)' }}>
                {[t('col_asset_details'), t('col_status'), t('col_added_on'), t('col_breaches'), t('col_actions')].map((h, i) => (
                  <th key={h} className={cn('px-6 py-4 text-xs font-bold uppercase tracking-wider', i === 4 ? 'text-right' : 'text-left')}
                    style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Search className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-border)' }} />
                    <p className="font-medium" style={{ color: 'var(--color-text-muted)' }}>{t('no_assets')}</p>
                    <button onClick={openAddAssetModal} className="mt-4 btn-primary text-sm">{t('add_first_asset')}</button>
                  </td>
                </tr>
              ) : (
                paged.map((asset: Asset) => (
                  <tr key={asset.id} className="transition-colors"
                    style={{ borderTop: '1px solid var(--color-border)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-row-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-sub)' }}>
                          {typeIcon(asset.type)}
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{asset.value}</p>
                          <p className="text-xs capitalize" style={{ color: 'var(--color-text-muted)' }}>{asset.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm">
                        <div className={cn('w-2 h-2 rounded-full', asset.status === 'Monitored' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse')} />
                        <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                          {asset.status === 'Monitored' ? t('status_monitored') : t('status_verifying')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--color-text-muted)' }}>{asset.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {asset.breaches > 0 ? (
                        <span className="flex items-center gap-1.5 text-sm font-bold text-red-500">
                          <AlertTriangle className="w-3.5 h-3.5" />{asset.breaches}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-green-500">
                          <ShieldCheck className="w-3.5 h-3.5" />Clean
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleDelete(asset.id)}
                          className={cn('p-2 rounded-lg text-sm transition-all', confirmDelete === asset.id ? 'bg-red-500/10 text-red-500 font-bold text-xs px-3' : '')}
                          style={confirmDelete !== asset.id ? { color: 'var(--color-text-muted)' } : undefined}>
                          {confirmDelete === asset.id ? t('confirm_delete') : <Trash2 className="w-4 h-4" />}
                        </button>
                        {confirmDelete !== asset.id && (
                          <button className="p-2 rounded-lg transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-sub)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Showing {paged.length} of {filtered.length} assets
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40 transition-colors border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)', backgroundColor: 'var(--color-bg-card)' }}>
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={cn('w-8 h-8 rounded-lg text-sm font-bold transition-colors', page === i + 1 ? 'bg-primary text-white' : 'border')}
                style={page !== i + 1 ? { borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-card)' } : undefined}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40 transition-colors border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)', backgroundColor: 'var(--color-bg-card)' }}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetMonitoring;
