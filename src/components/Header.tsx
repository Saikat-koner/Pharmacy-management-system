import React, { useState, useEffect } from 'react';
import { Pill, ShieldCheck, Clock, Phone, User, Lock, RotateCcw } from 'lucide-react';
import { PortalMode } from '../types/pharmacy';

interface HeaderProps {
  portalMode: PortalMode;
  onTogglePortalMode: (mode: PortalMode) => void;
  onResetData: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  portalMode,
  onTogglePortalMode,
  onResetData,
  onGoHome,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Store Identity */}
          <div 
            onClick={onGoHome}
            className="flex items-center space-x-3.5 cursor-pointer group"
            title="Go to PharmaCare Home"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              <Pill className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading group-hover:text-emerald-700 transition-colors">
                  PharmaCare
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> Licensed Rx
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                <span>Pharmacy Management System</span>
                <span className="hidden md:inline text-slate-300">•</span>
                <span className="hidden md:inline text-slate-400 font-mono text-[11px]">
                  DL: 20B/44910
                </span>
              </p>
            </div>
          </div>

          {/* Center / Right: Portal Switcher & Store Meta */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
            {/* Store Helpline */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono text-[11px] font-medium">+91 98450 99882</span>
            </div>

            {/* Live Clock */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{time}</span>
            </div>

            {/* Role / Portal Switcher Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/90 shadow-inner">
              <button
                type="button"
                onClick={() => onTogglePortalMode('user')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  portalMode === 'user'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer Portal</span>
              </button>

              <button
                type="button"
                onClick={() => onTogglePortalMode('admin')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  portalMode === 'admin'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            </div>

            {/* Reset Data */}
            <button
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset sample records"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
