import { useEffect, useState } from 'react';
import api from '../services/api';
import { cn } from '../utils/cn';

interface SyncStatus {
  source: string;
  lastSyncAt: string | null;
  breachCount: number;
}

/** Compact SOC-style feed indicator — header only, no banner. */
const IntelStatus = ({ className }: { className?: string }) => {
  const [status, setStatus] = useState<SyncStatus | null>(null);

  useEffect(() => {
    api.get('/intelligence/sync-status')
      .then((res) => setStatus(res.data))
      .catch(() => setStatus(null));
  }, []);

  if (!status) return null;

  const live = status.source === 'hibp';
  const synced = status.lastSyncAt
    ? new Date(status.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div className={cn('hidden md:flex items-center gap-2 font-mono text-[11px] text-text-muted', className)}>
      <span className={cn('inline-block w-1.5 h-1.5 rounded-full', live ? 'bg-emerald-500' : 'bg-amber-500')} />
      <span>{live ? 'HIBP' : 'CORPUS'}</span>
      <span className="text-border">|</span>
      <span>{status.breachCount.toLocaleString()} records</span>
      <span className="text-border">|</span>
      <span>sync {synced}</span>
    </div>
  );
};

export default IntelStatus;
