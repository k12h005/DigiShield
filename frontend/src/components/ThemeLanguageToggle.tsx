import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, type Language } from '../context/LanguageContext';
import { cn } from '../utils/cn';

const LANGUAGES: { code: Language; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'हिंदी', short: 'HI' },
  { code: 'gu', label: 'ગુજરાતી', short: 'GU' },
];

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40',
        isDark ? 'bg-primary/20 border border-primary/30' : 'bg-gray-200 border border-gray-300'
      )}
    >
      {/* Track icons */}
      <Sun className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-yellow-500 opacity-70" />
      <Moon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary opacity-70" />
      {/* Thumb */}
      <span
        className={cn(
          'absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center',
          isDark
            ? 'right-0.5 bg-primary'
            : 'left-0.5 bg-white'
        )}
      >
        {isDark
          ? <Moon className="w-3.5 h-3.5 text-white" />
          : <Sun className="w-3.5 h-3.5 text-yellow-500" />
        }
      </span>
    </button>
  );
};

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === language)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors',
          open
            ? 'bg-primary/10 text-primary'
            : 'text-text-muted hover:bg-gray-100 dark:hover:bg-white/5 hover:text-text'
        )}
        aria-label="Select language"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden">{current.short}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1.5 w-36 rounded-xl shadow-xl border overflow-hidden z-50 animate-modal-in"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border)',
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={language === lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={cn(
                'w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between',
                language === lang.code
                  ? 'text-primary font-bold'
                  : 'text-text-muted hover:text-text'
              )}
              style={language !== lang.code ? { ':hover': { backgroundColor: 'var(--color-bg-sub)' } } as React.CSSProperties : undefined}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-sub)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              {lang.label}
              {language === lang.code && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
