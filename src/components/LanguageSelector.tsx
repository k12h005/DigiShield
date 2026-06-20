import { Globe } from 'lucide-react';
import { useI18n, type Locale } from '../i18n';
import { cn } from '../utils/cn';

const locales: { code: Locale; labelKey: 'en' | 'hi' | 'gu' }[] = [
  { code: 'en', labelKey: 'en' },
  { code: 'hi', labelKey: 'hi' },
  { code: 'gu', labelKey: 'gu' },
];

interface LanguageSelectorProps {
  className?: string;
  compact?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className, compact = false }) => {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {!compact && <Globe className="w-4 h-4 text-text-muted shrink-0" aria-hidden />}
      <label className="sr-only" htmlFor="language-select">{t.language.label}</label>
      <select
        id="language-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className={cn(
          'bg-surface border border-border rounded-lg text-sm font-semibold text-text',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors',
          compact ? 'px-2 py-1.5' : 'px-3 py-2',
        )}
        aria-label={t.language.label}
      >
        {locales.map((item) => (
          <option key={item.code} value={item.code}>
            {t.language[item.labelKey]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
