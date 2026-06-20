import React, { useRef, useEffect } from 'react';
import { User, Settings, LogOut, Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileMenu: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, setSettingsTab } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  const goToSettings = (tab: string) => {
    setSettingsTab(tab);
    navigate('/settings');
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-xl z-50 overflow-hidden animate-modal-in"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* User identity */}
      <div
        className="px-4 py-4"
        style={{
          backgroundColor: 'var(--color-bg-sub)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {user.role}
            </p>
          </div>
        </div>
        <p
          className="text-[11px] mt-2 truncate"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {user.email}
        </p>
      </div>

      {/* Menu items */}
      <div className="p-2">
        {[
          { icon: User, label: t('my_profile'), tab: 'Profile' },
          { icon: Shield, label: t('security'), tab: 'Security' },
          { icon: Settings, label: t('nav_settings'), tab: 'Profile' },
        ].map(({ icon: Icon, label, tab }) => (
          <button
            key={label}
            onClick={() => goToSettings(tab)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-sub)';
              e.currentTarget.style.color = 'var(--color-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4" />
              {label}
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      <div className="p-2" style={{ borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          {t('sign_out')}
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;
