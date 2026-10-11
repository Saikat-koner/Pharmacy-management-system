import React from 'react';
import { 
  Pill, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Search, 
  FileText, 
  Mail, 
  Phone, 
  ArrowRight, 
  HeartPulse, 
  Truck, 
  CheckCircle,
  Building2,
  Receipt,
  Layers,
  Sparkles,
  UserCheck,
  Stethoscope
} from 'lucide-react';
import { Medicine, PharmacyShop } from '../types/pharmacy';

interface HomeViewProps {
  medicines: Medicine[];
  shops: PharmacyShop[];
  categories: string[];
  onNavigateTab: (tab: any) => void;
  onFilterCategory: (category: string) => void;
  onSwitchToAdmin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  medicines,
  shops,
  categories,
  onNavigateTab,
  onFilterCategory,
  onSwitchToAdmin,
}) => {
  const emergencyShopsCount = shops.filter((s) => s.is24x7).length;
  const inStockCount = medicines.filter((m) => m.quantity > 0).length;

  return (
    <div className="space-y-10">
      {/* 1. Hero Section */}
      <section aria-labelledby="hero-title" className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Decorative soft circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Licensed Chemists &amp; Druggists • 24x7 Care • Schedule H Compliant</span>
          </div>

          <h1 id="hero-title" className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading leading-tight">
            PharmaCare Pharmacy Management System
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans">
            Welcome to PharmaCare. Our digital pharmacy platform connects customers with genuine medicines, verified store locations, and instant email enquiries — while empowering pharmacy staff with full inventory control, therapeutic classifications, and point-of-sale billing.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('browse-medicines')}
              className="px-5 py-3 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-emerald-700" />
              <span>Browse Medicines Catalog</span>
            </button>

            <button
              onClick={() => onNavigateTab('shop-locator')}
              className="px-5 py-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>Locate Nearby Shops ({shops.length} Branches)</span>
            </button>

            <button
              onClick={() => onNavigateTab('enquiry')}
              className="px-4 py-3 rounded-xl bg-teal-800/60 hover:bg-teal-800 text-teal-100 font-semibold text-xs sm:text-sm border border-teal-600/40 transition-all cursor-pointer flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-teal-300" />
              <span>Send Medicine Enquiry</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-emerald-100">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-300 shrink-0" />
            <span><strong>{inStockCount}</strong> Medicines In Stock</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span><strong>{shops.length}</strong> Store Branches on Map</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-300 shrink-0" />
            <span><strong>{categories.length}</strong> Therapeutic Categories</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
            <span><strong>{emergencyShopsCount}</strong> 24/7 Emergency Branches</span>
          </div>
        </div>
      </section>

      {/* 2. What This Website Does (Comprehensive Overview) */}
      <section aria-labelledby="about-system-heading" className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 id="about-system-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            What This Website Does
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            PharmaCare is designed as an end-to-end healthcare solution with dedicated features for both public visitors and pharmacy administrators.
          </p>
        </div>

        {/* Two Portal Comparison Cards (Customer vs Admin) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Portal Features Card */}
          <article className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-emerald-300 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 font-heading">
                  For Patients &amp; Public Customers
                </h3>
                <span className="text-xs text-emerald-700 font-semibold">Customer Portal Capabilities</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Find medicines, explore health details, locate open chemist shops, and submit direct enquiries without waiting in queues.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Search &amp; Filter Medicines:</strong> Check generic names, dosage forms, strength, prices, and stock availability across categories.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Interactive Branch Locator:</strong> View nearby pharmacy stores on an interactive map with direct phone numbers, hours, and navigation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Medicine &amp; Refill Enquiry:</strong> Submit an enquiry for rare medicines or urgent refills, and track pharmacist replies.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Health &amp; Clinical Advisory:</strong> Read antibiotic adherence rules, cold-chain storage safety, and doctor prescription norms.</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('browse-medicines')}
                className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Start Browsing Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>

          {/* Admin & Staff Portal Features Card */}
          <article className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-teal-300 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 font-heading">
                  For Pharmacists &amp; Store Administrators
                </h3>
                <span className="text-xs text-teal-700 font-semibold">Admin Portal Capabilities</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Maintain full administrative control over dispensary operations, inventory levels, store locations, and daily sales billing.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Inventory Management:</strong> Add new medicines, edit details, adjust quantities, quarantine expired batches, and restock.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Therapeutic Categories Control:</strong> Create, rename, and manage pharmacology categories linked to medicines.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Store Locations Manager:</strong> Add new store branches with exact map coordinates, edit timings, or update store managers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Enquiry Inbox &amp; POS Billing:</strong> Answer customer enquiries and issue GST retail tax invoices with printable cash memos.</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onSwitchToAdmin}
                className="w-full py-2.5 px-4 bg-teal-700 text-white hover:bg-teal-800 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Enter Admin &amp; Staff Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* 3. Browse Therapeutic Categories Grid */}
      <section aria-labelledby="categories-heading" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="categories-heading" className="text-lg font-bold text-slate-900 font-heading">
              Browse by Therapeutic Category
            </h2>
            <p className="text-xs text-slate-500">
              Click any therapeutic class to view approved medications and dosages
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('browse-medicines')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer self-start sm:self-center"
          >
            <span>View all medicines ({medicines.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {categories.map((cat) => {
            const count = medicines.filter((m) => m.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  onFilterCategory(cat);
                  onNavigateTab('browse-medicines');
                }}
                className="p-3.5 text-left rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200/90 transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 line-clamp-1 font-heading">
                  {cat}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  {count} {count === 1 ? 'medicine' : 'medicines'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Pharmacy Branches Preview */}
      <section aria-labelledby="branches-preview-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="branches-preview-heading" className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Our Pharmacy Branches &amp; Dispensary Network
            </h2>
            <p className="text-xs text-slate-500">
              Find physical branch locations with dedicated pharmacists and emergency counters
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('shop-locator')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Interactive Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shops.slice(0, 3).map((shop) => (
            <div
              key={shop.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-heading">
                    {shop.name}
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold mt-1 inline-block">
                    {shop.branchCode}
                  </span>
                </div>
                {shop.is24x7 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    24x7 Open
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {shop.address}, {shop.city}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={`tel:${shop.phone.replace(/[^0-9+]/g, '')}`}
                  className="font-mono text-emerald-700 hover:underline flex items-center gap-1 text-xs"
                >
                  <Phone className="w-3 h-3" />
                  <span>{shop.phone}</span>
                </a>
                <button
                  onClick={() => onNavigateTab('shop-locator')}
                  className="text-slate-500 hover:text-emerald-700 font-medium text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>View Map →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How It Works (3 Steps) */}
      <section aria-labelledby="how-it-works-heading" className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 id="how-it-works-heading" className="text-xl font-bold text-slate-900 font-heading">
            How PharmaCare Works
          </h2>
          <p className="text-xs text-slate-500">
            Simple, safe, and transparent medicine management for every patient
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center font-heading text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Browse or Enquire
            </h3>
            <p className="text-xs text-slate-600">
              Search by brand or salt name, or send an enquiry ticket for specialized prescription medicines.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center font-heading text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Pharmacist Verification
            </h3>
            <p className="text-xs text-slate-600">
              Our registered pharmacists confirm stock, verify doctor details, and maintain temperature stability.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center font-heading text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Pickup or Fast Delivery
            </h3>
            <p className="text-xs text-slate-600">
              Pick up at your nearest mapped branch or receive home delivery with GST retail cash memo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
