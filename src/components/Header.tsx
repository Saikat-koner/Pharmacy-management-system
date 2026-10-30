import React, { useState, useEffect } from 'react';
import { Pill, ShieldCheck, Clock, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onResetData: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
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
            className="flex items-center space-x-3 cursor-pointer group"
            title="Go to Pharmacy Home"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Pill className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading group-hover:text-emerald-700 transition-colors">
                  Pharmacy Management System
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Licensed Rx
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Simple &amp; Fast Medicine Store Portal • Unit 1, 2 &amp; 3 Web Project
              </p>
            </div>
          </div>

          {/* Right utility: Live Clock & Reset Demo */}
          <div className="flex items-center space-x-3">
            {time && (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{time}</span>
              </div>
            )}

            <button
              type="button"
              onClick={onResetData}
              title="Reset medicines and sales back to default demo data"
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
