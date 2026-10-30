import React from 'react';
import { 
  Home, 
  Pill, 
  Receipt, 
  History, 
  MapPin, 
  AlertTriangle 
} from 'lucide-react';

export type AppTabType = 'home' | 'medicines' | 'billing' | 'sales' | 'store';

interface NavigationProps {
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  lowStockCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  lowStockCount,
}) => {
  const navItems = [
    {
      id: 'home' as AppTabType,
      label: 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'medicines' as AppTabType,
      label: 'Medicines & Stock',
      icon: Pill,
      badge: lowStockCount > 0 ? (
        <span 
          title={`${lowStockCount} medicines with low stock`}
          className="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1"
        >
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          {lowStockCount}
        </span>
      ) : null,
    },
    {
      id: 'billing' as AppTabType,
      label: 'New Bill (POS)',
      icon: Receipt,
      badge: null,
    },
    {
      id: 'sales' as AppTabType,
      label: 'Sales History',
      icon: History,
      badge: null,
    },
    {
      id: 'store' as AppTabType,
      label: 'Store & Contact',
      icon: MapPin,
      badge: null,
    },
  ];

  return (
    <nav 
      aria-label="Main Navigation" 
      className="bg-white border-b border-slate-200 shadow-xs sticky top-20 z-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
