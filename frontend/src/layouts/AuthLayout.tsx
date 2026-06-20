import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Content */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-3 mb-10 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <ShieldAlert className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-2xl text-text tracking-tight">CyberGuard</span>
          </Link>
          <Outlet />
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 bg-secondary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <ShieldAlert className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-text mb-4">Protecting your digital assets</h2>
              <p className="text-text-muted text-lg">
                Real-time monitoring and legal intelligence to keep your information secure and compliant.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2 bg-gray-200 rounded-full"></div>
            ))}
            <div className="h-2 bg-primary w-1/2 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
