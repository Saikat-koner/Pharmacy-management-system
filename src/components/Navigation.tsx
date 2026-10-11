import React from 'react';
import { 
  Home,
  LayoutDashboard, 
  Pill, 
  Receipt, 
  PlusCircle, 
  FileText,
  Truck,
  MapPin,
  Mail,
  Layers,
  Building,
  HeartPulse
} from 'lucide-react';
import { PortalMode } from '../types/pharmacy';

export type UserTabType = 
  | 'home'
  | 'browse-medicines'
  | 'shop-locator'
  | 'enquiry'
  | 'store-info';

export type AdminTabType = 
  | 'dashboard' 
  | 'inventory' 
  | 'add-medicine' 
  | 'categories-manager'
  | 'shop-locator'
  | 'admin-enquiries'
  | 'billing' 
  | 'prescriptions'
  | 'suppliers';

export type AppTabType = UserTabType | AdminTabType;

interface NavItem {
  id: AppTabType;
  label: string;
  icon: any;
  badge: React.ReactNode;
  highlight?: boolean;
}

interface NavigationProps {
  portalMode: PortalMode;
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  lowStockCount: number;
  newEnquiriesCount: number;
  pendingPrescriptionsCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  portalMode,
  activeTab,
  setActiveTab,
  lowStockCount,
  newEnquiriesCount,
  pendingPrescriptionsCount = 0,
}) => {
  const userNavItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'browse-medicines',
      label: 'Browse Medicines',
      icon: Pill,
      badge: null,
    },
    {
      id: 'shop-locator',
      label: 'Store Locations & Map',
      icon: MapPin,
      badge: null,
    },
    {
      id: 'enquiry',
      label: 'Send Medicine Enquiry',
      icon: Mail,
      badge: null,
    },
    {
      id: 'store-info',
      label: 'Health Advisory & Guides',
      icon: HeartPulse,
      badge: null,
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      id: 'dashboard' as AppTabType,
      label: 'Overview Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'inventory' as AppTabType,
      label: 'Medicine Inventory',
      icon: Pill,
      badge: lowStockCount > 0 ? (
        <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          {lowStockCount}
        </span>
      ) : null,
    },
    {
      id: 'add-medicine' as AppTabType,
      label: 'Add Medicine Form',
      icon: PlusCircle,
      badge: null,
      highlight: true,
    },
    {
      id: 'categories-manager' as AppTabType,
      label: 'Therapeutic Categories',
      icon: Layers,
      badge: null,
    },
    {
      id: 'shop-locator' as AppTabType,
      label: 'Manage Store Map',
      icon: MapPin,
      badge: null,
    },
    {
      id: 'admin-enquiries' as AppTabType,
      label: 'Customer Enquiries',
      icon: Mail,
      badge: newEnquiriesCount > 0 ? (
        <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          {newEnquiriesCount}
        </span>
      ) : null,
    },
    {
      id: 'billing' as AppTabType,
      label: 'POS Billing Counter',
      icon: Receipt,
      badge: null,
    },
    {
      id: 'prescriptions' as AppTabType,
      label: 'Prescriptions Queue',
      icon: FileText,
      badge: pendingPrescriptionsCount > 0 ? (
        <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          {pendingPrescriptionsCount}
        </span>
      ) : null,
    },
    {
      id: 'suppliers' as AppTabType,
      label: 'Suppliers Directory',
      icon: Truck,
      badge: null,
    },
  ];

  const currentItems = portalMode === 'user' ? userNavItems : adminNavItems;

  return (
    <nav aria-label="Main Navigation" className="bg-white border-b border-slate-200 sticky top-20 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {currentItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? item.highlight
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs'
                    : item.highlight
                    ? 'bg-emerald-50/70 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 mr-2 ${
                    isActive
                      ? item.highlight
                        ? 'text-white'
                        : 'text-emerald-700'
                      : item.highlight
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                />
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
