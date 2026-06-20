import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Smartphone, Globe, Plus, Loader2 } from 'lucide-react';
import { useApp, type AssetType } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

const AddAssetModal: React.FC = () => {
  const { isAddAssetModalOpen, closeAddAssetModal, addAsset } = useApp();
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<AssetType>('email');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const assetTypes: { type: AssetType; icon: React.ElementType; label: string; placeholder: string }[] = [
    { type: 'email', icon: Mail, label: t('type_email'), placeholder: 'name@example.com' },
    { type: 'phone', icon: Smartphone, label: t('type_phone'), placeholder: '+91 9876543210' },
    { type: 'domain', icon: Globe, label: t('type_domain'), placeholder: 'mybusiness.in' },
  ];

  useEffect(() => {
    if (isAddAssetModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setValue(''); setError(''); setSuccess(false); setSelectedType('email');
    }
  }, [isAddAssetModalOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAddAssetModal(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeAddAssetModal]);

  const validate = (): boolean => {
    if (!value.trim()) { setError(t('err_required')); return false; }
    if (selectedType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(t('err_email')); return false;
    }
    if (selectedType === 'phone' && !/^\+?[\d\s\-()]{7,15}$/.test(value)) {
      setError(t('err_phone')); return false;
    }
    if (selectedType === 'domain' && !/^[\w.-]+\.[a-z]{2,}$/i.test(value)) {
      setError(t('err_domain')); return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    addAsset({ type: selectedType, value: value.trim() });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => { closeAddAssetModal(); setSuccess(false); }, 1200);
  };

  if (!isAddAssetModalOpen) return null;

  const current = assetTypes.find((x) => x.type === selectedType)!;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={closeAddAssetModal}
      />

      {/* Panel */}
      <div
        className="relative rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-in"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pt-6 pb-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div>
            <h2
              id="modal-title"
              className="text-xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              {t('modal_title')}
            </h2>
            <p
              className="text-sm mt-0.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('modal_subtitle')}
            </p>
          </div>
          <button
            onClick={closeAddAssetModal}
            className="p-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5 pt-5">
          {/* Asset type selector */}
          <div>
            <label
              className="text-sm font-bold block mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              {t('asset_type')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {assetTypes.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setSelectedType(type); setError(''); setValue(''); }}
                  className={cn(
                    'flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all',
                    selectedType === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : ''
                  )}
                  style={
                    selectedType !== type
                      ? { borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }
                      : undefined
                  }
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Value input */}
          <div>
            <label
              className="text-sm font-bold block mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              {current.label}
            </label>
            <div className="relative">
              <current.icon
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--color-text-muted)' }}
              />
              <input
                ref={inputRef}
                type={selectedType === 'email' ? 'email' : 'text'}
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(''); }}
                placeholder={current.placeholder}
                className={cn('input-field pl-10', error && 'border-red-400')}
              />
            </div>
            {error && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
            )}
          </div>

          {/* Note */}
          <div
            className="rounded-lg px-4 py-3 text-xs leading-relaxed"
            style={{ backgroundColor: 'var(--color-bg-sub)', color: 'var(--color-text-muted)' }}
          >
            {t('modal_note')}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeAddAssetModal}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-sub)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {t('btn_cancel')}
            </button>
            <button
              type="submit"
              disabled={saving || success}
              className={cn(
                'flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all',
                success ? 'bg-green-500 text-white' : 'btn-primary'
              )}
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {t('btn_scanning')}</>
              ) : success ? (
                t('btn_asset_added')
              ) : (
                <><Plus className="w-4 h-4" /> {t('btn_add_asset')}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
