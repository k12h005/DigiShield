import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import api from '../services/api';
import { cn } from '../utils/cn';

/** Small resync control — Threat Intel page only. */
const IntelResyncButton = ({ onDone }: { onDone?: () => void }) => {
  const [busy, setBusy] = useState(false);

  const resync = async () => {
    setBusy(true);
    try {
      await api.post('/intelligence/refresh');
      onDone?.();
    } catch (err) {
      console.error('Resync failed', err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={resync}
      disabled={busy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-[11px] font-mono font-semibold text-text-muted hover:text-text hover:border-gray-300 transition-colors disabled:opacity-50"
    >
      <RefreshCw className={cn('w-3 h-3', busy && 'animate-spin')} />
      resync
    </button>
  );
};

export default IntelResyncButton;
