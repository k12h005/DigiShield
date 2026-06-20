import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen lg:min-h-[100dvh] flex flex-col lg:flex-row overflow-x-hidden">
      <div className="relative lg:w-[48%] xl:w-[52%] min-h-[220px] lg:min-h-screen auth-landscape-panel overflow-hidden">
        <div className="absolute inset-0 auth-gradient-bg" />
        <div className="absolute inset-0 auth-pattern opacity-40" />
        <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-12">
          <Link to="/" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors w-fit">
            <div className="w-11 h-11 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">DigiShield</span>
          </Link>

          <div className="hidden lg:block max-w-md">
            <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Cyber Intelligence Platform</p>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 text-balance">
              Protect your digital identity in real time.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Monitor domains, detect breach exposure, and get legal guidance built for citizens, legal teams, and government.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex -space-x-2">
              {['A', 'L', 'G'].map((letter) => (
                <div key={letter} className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-bold text-white">
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-sm text-white/70">Trusted by legal & government ecosystems</p>
          </div>
        </div>

        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 lg:py-12 bg-page relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <LanguageSelector compact />
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ShieldAlert className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-text">DigiShield</span>
          </div>
          <div className="card rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
