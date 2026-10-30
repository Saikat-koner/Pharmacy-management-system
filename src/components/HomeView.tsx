import React from 'react';
import { 
  Pill, 
  Receipt, 
  History, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Package
} from 'lucide-react';
import { Medicine, BillReceipt } from '../types/pharmacy';
import { AppTabType } from './Navigation';

interface HomeViewProps {
  medicines: Medicine[];
  sales: BillReceipt[];
  onNavigateTab: (tab: AppTabType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  medicines,
  sales,
  onNavigateTab,
}) => {
  const totalMedicines = medicines.length;
  const totalStockUnits = medicines.reduce((sum, m) => sum + m.quantity, 0);
  const lowStockCount = medicines.filter((m) => m.quantity <= m.minAlertLevel).length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.grandTotal, 0);

  return (
    <div className="space-y-8">
      {/* 1. Welcoming Hero Banner */}
      <section 
        aria-labelledby="home-welcome-heading"
        className="bg-white border border-emerald-100 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden"
      >
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CSE326 Web Technologies • Pharmacy Management System</span>
          </div>

          <h1 
            id="home-welcome-heading" 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-heading"
          >
            Welcome to Pharmacy Management System
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
            A simple, fast, and easy-to-use web application to manage medicine inventory, 
            generate customer sales bills with instant receipts, track transaction records, 
            and view pharmacy store information.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('medicines')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Pill className="w-4 h-4" />
              <span>View Medicines &amp; Stock</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('billing')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>Open Billing Counter</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Statistics Cards (HTML & CSS flex/grid) */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">System Overview Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Medicines */}
          <article className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Medicines</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{totalMedicines}</p>
              <p className="text-xs text-slate-400">Unique formulations</p>
            </div>
          </article>

          {/* Total Units in Stock */}
          <article className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Units in Stock</p>
              <p className="text-2xl font-bold text-emerald-700 font-heading">{totalStockUnits}</p>
              <p className="text-xs text-slate-400">Available across shelves</p>
            </div>
          </article>

          {/* Low Stock Alert */}
          <article className={`p-5 rounded-2xl border shadow-xs flex items-center space-x-4 ${
            lowStockCount > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-200'
          }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              lowStockCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-500'
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Alert</p>
              <p className={`text-2xl font-bold font-heading ${lowStockCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                {lowStockCount}
              </p>
              <p className="text-xs text-slate-400">
                {lowStockCount > 0 ? 'Needs reordering' : 'All stocks healthy'}
              </p>
            </div>
          </article>

          {/* Total Sales */}
          <article className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">
                ₹{totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-slate-400">{sales.length} completed bills</p>
            </div>
          </article>
        </div>
      </section>

      {/* 3. What This Website Does Section */}
      <section aria-labelledby="features-heading" className="space-y-4">
        <div>
          <h2 id="features-heading" className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            What This Website Does
          </h2>
          <p className="text-sm text-slate-500">
            A quick overview of the key functions available in this pharmacy system:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Inventory */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">1. Manage Medicines &amp; Stock</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              View all available medicines with categories, batch numbers, expiry dates, and prices. 
              Easily search items, add new medicines, edit existing records, and adjust stock quantities with quick 
              <span className="font-semibold text-emerald-700"> [+] </span> and 
              <span className="font-semibold text-rose-700"> [-] </span> buttons.
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('medicines')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Go to Medicines List</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Billing POS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">2. Fast Counter Billing (POS)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Quickly create customer receipts: select medicines from the catalog, specify quantities, 
              view subtotal with tax calculation, enter customer information, and complete the sale. 
              The system automatically deducts stock and generates a printable receipt.
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('billing')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Open Billing Counter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Sales History */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">3. View Sales History &amp; Receipts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Review every completed transaction. Filter through past invoices, check customer names, 
              payment modes, and timestamps, or click to open and reprint the clean receipt modal anytime.
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('sales')}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>View Sales Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Store & Contact */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">4. Store Branches &amp; Enquiries</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Find verified pharmacy store branches with addresses, emergency hours, and phone numbers. 
              Customers can also submit medicine availability enquiries using the built-in contact form.
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('store')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>View Store Locations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
