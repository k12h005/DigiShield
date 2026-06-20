import { Moon, Sun } from 'lucide-react';
import { useI18n } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t.theme.toggle}
      title={t.theme.toggle}
      className={cn(
        'p-2.5 rounded-xl transition-colors text-text-muted hover:text-text hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        className,
      )}
    >
      <span className="flex items-center gap-2">
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        {showLabel && (
          <span className="text-sm font-semibold">{theme === 'light' ? t.theme.dark : t.theme.light}</span>
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
