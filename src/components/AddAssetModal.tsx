import React, { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import api from '../services/api';

interface AddAssetModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultType?: 'domain' | 'email' | 'phone';
  defaultValue?: string;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({
  open,
  onClose,
  onSuccess,
  defaultType = 'domain',
  defaultValue = '',
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ type: defaultType, value: defaultValue });

  React.useEffect(() => {
    if (open) {
      setForm({ type: defaultType, value: defaultValue });
      setError('');
    }
  }, [open, defaultType, defaultValue]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/assets', form);
      onSuccess?.();
      onClose();
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string; detail?: string } } };
      setError(apiError.response?.data?.message || apiError.response?.data?.detail || 'Failed to add asset');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-text">Add Monitored Asset</h2>
            <p className="text-sm text-text-muted mt-1">Start tracking domain exposure instantly.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>
          )}
          <div>
            <label className="text-sm font-semibold text-text">Asset Type</label>
            <select
              className="input-field mt-1"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as 'domain' | 'email' | 'phone' })}
            >
              <option value="domain">Domain</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-text">Value</label>
            <input
              className="input-field mt-1"
              placeholder={form.type === 'domain' ? 'adobe.com' : form.type === 'email' ? 'you@company.com' : '+91 XXXXX XXXXX'}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={submitting} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Monitoring'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
