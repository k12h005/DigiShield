import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Smartphone, Globe, Plus, Search, Trash2, ShieldCheck, Filter, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import api from '../services/api';
import AddAssetModal from '../components/AddAssetModal';

interface Asset {
    id: string;
    type: 'email' | 'phone' | 'domain';
    value: string;
    status: string;
    lastChecked: string;
    createdAt: string;
    breaches: number;
}

const AssetMonitoring: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    const fetchAssets = async () => {
        try {
            const response = await api.get('/assets');
            setAssets(response.data);
        } catch (err) {
            console.error('Failed to fetch assets', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const filteredAssets = useMemo(() => {
        return assets.filter((asset) => {
            const tabMatch =
                activeTab === 'all' ||
                (activeTab === 'emails' && asset.type === 'email') ||
                (activeTab === 'phones' && asset.type === 'phone') ||
                (activeTab === 'domains' && asset.type === 'domain');
            const searchMatch = asset.value.toLowerCase().includes(search.toLowerCase());
            return tabMatch && searchMatch;
        });
    }, [assets, activeTab, search]);

    const stats = useMemo(() => ({
        emails: assets.filter((a) => a.type === 'email').length,
        phones: assets.filter((a) => a.type === 'phone').length,
        domains: assets.filter((a) => a.type === 'domain').length,
    }), [assets]);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/assets/${id}`);
            setAssets((prev) => prev.filter((asset) => asset.id !== id));
        } catch (err) {
            console.error('Failed to delete asset', err);
        }
    };

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
                    <h1 className="text-3xl font-bold text-text">Asset Monitoring</h1>
                    <p className="text-text-muted mt-1">Monitor emails, phones, and domains against live breach intelligence.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Add New Asset
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Emails', count: stats.emails, icon: Mail },
                    { label: 'Phones', count: stats.phones, icon: Smartphone },
                    { label: 'Domains', count: stats.domains, icon: Globe },
                ].map((s) => (
                    <div key={s.label} className="card flex items-center gap-5">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <s.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-muted">{s.label}</p>
                            <h3 className="text-2xl font-bold text-text">{s.count}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex bg-secondary p-1 rounded-lg w-fit">
                        {['all', 'emails', 'phones', 'domains'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-semibold rounded-md transition-all capitalize",
                                    activeTab === tab ? "bg-white text-text shadow-sm" : "text-text-muted hover:text-text"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-secondary border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none w-full sm:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Asset Details</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Last Checked</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Breach Hits</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAssets.length > 0 ? filteredAssets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                {asset.type === 'email' ? <Mail className="w-4 h-4 text-gray-500" /> :
                                                 asset.type === 'phone' ? <Smartphone className="w-4 h-4 text-gray-500" /> :
                                                 <Globe className="w-4 h-4 text-gray-500" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text">{asset.value}</p>
                                                <p className="text-xs text-text-muted capitalize">{asset.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                asset.status === 'monitored' ? 'bg-green-500' :
                                                asset.status === 'unsupported' ? 'bg-yellow-500' : 'bg-gray-400'
                                            )}></div>
                                            <span className="font-medium text-text capitalize">{asset.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                                        {new Date(asset.lastChecked).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-text">
                                        {asset.breaches > 0 ? (
                                            <span className="text-red-500 flex items-center gap-1">
                                                <ShieldCheck className="w-4 h-4" /> {asset.breaches}
                                            </span>
                                        ) : '0'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => handleDelete(asset.id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-text-muted hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-text-muted">
                                        No assets yet. Add a domain like <strong>adobe.com</strong> or <strong>linkedin.com</strong> to see live breach matches.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddAssetModal open={showModal} onClose={() => setShowModal(false)} onSuccess={fetchAssets} />
        </div>
    );
};

export default AssetMonitoring;
