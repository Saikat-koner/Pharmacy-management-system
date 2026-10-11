import React from 'react';
import { Medicine, PrescriptionOrder, BillReceipt } from '../types/pharmacy';
import { AppTabType } from './Navigation';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Receipt
} from 'lucide-react';

interface DashboardViewProps {
  medicines: Medicine[];
  prescriptions: PrescriptionOrder[];
  recentBills: BillReceipt[];
  onNavigateTab: (tab: AppTabType) => void;
  onFilterCategory: (category: string) => void;
  onViewBillReceipt: (bill: BillReceipt) => void;
  onQuickRestock: (id: string, qty: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  medicines,
  prescriptions,
  recentBills,
  onNavigateTab,
  onFilterCategory,
  onViewBillReceipt,
  onQuickRestock,
}) => {
  const totalStockItems = medicines.reduce((acc, m) => acc + m.quantity, 0);
  const totalInventoryValue = medicines.reduce((acc, m) => acc + m.quantity * m.unitPrice, 0);
  
  const lowStockMedicines = medicines.filter(
    (m) => m.quantity > 0 && m.quantity <= m.minAlertLevel
  );
  
  const outOfStockMedicines = medicines.filter((m) => m.quantity === 0);
  
  const pendingRxCount = prescriptions.filter((p) => p.status === 'Pending').length;
  
  const todayRevenue = recentBills.reduce((acc, b) => acc + b.grandTotal, 0);

  // Group by category
  const categoryCounts = medicines.reduce<Record<string, number>>((acc, med) => {
    acc[med.category] = (acc[med.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Daily Pharmacy Operations Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
              Pharmacy Store Operations &amp; Real-time Stock Monitor
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Live retail dispensary workflow, automated expiry alerts, schedule drug compliance, and POS sales ledger.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-3 py-1 bg-white text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg font-mono">
            Dispensary Active • Shift 1
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Medicines
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900 font-heading">
              {medicines.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({totalStockItems} units in stock)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-2 font-mono">
            <span>Inventory Value:</span>
            <span className="font-semibold text-slate-700">₹{totalInventoryValue.toFixed(2)}</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Low Stock Alert
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-amber-700 font-heading">
              {lowStockMedicines.length}
            </span>
            <span className="text-xs text-amber-800 font-medium">
              Needs reorder soon
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-2 font-mono">
            <span>Out of stock:</span>
            <span className="font-semibold text-rose-600">{outOfStockMedicines.length} items</span>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Today's Billing
            </span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900 font-heading">
              ₹{todayRevenue.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-2 font-mono">
            <span>Invoices processed:</span>
            <span className="font-semibold text-slate-700">{recentBills.length} bills</span>
          </div>
        </div>

        {/* Rx Queue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Doctor Prescriptions
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900 font-heading">
              {pendingRxCount}
            </span>
            <span className="text-xs text-blue-700 font-medium">
              Pending dispensing
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-2 font-mono">
            <span>Total records:</span>
            <span className="font-semibold text-slate-700">{prescriptions.length} Rx</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Low Stock Action Items & Inventory Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Inventory Attention */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-heading flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Urgent Stock Attention
                </h3>
                <p className="text-xs text-slate-500">
                  Medicines below safety buffer or completely out of stock
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('inventory')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                View all inventory <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {[...outOfStockMedicines, ...lowStockMedicines].length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All medicine stock levels are healthy!
                </div>
              ) : (
                [...outOfStockMedicines, ...lowStockMedicines].slice(0, 5).map((med) => {
                  const isOut = med.quantity === 0;
                  return (
                    <div key={med.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 font-heading">
                            {med.name}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {med.strength}
                          </span>
                          {med.requiresPrescription && (
                            <span className="px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded">
                              Rx Only
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{med.category}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-600">{med.rackLocation}</span>
                          <span>•</span>
                          <span>Batch: {med.batchNo}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              isOut
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isOut ? '0 (Out of Stock)' : `${med.quantity} left (Min: ${med.minAlertLevel})`}
                          </span>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            ₹{med.unitPrice.toFixed(2)}/unit
                          </div>
                        </div>
                        <button
                          onClick={() => onQuickRestock(med.id, 50)}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Simulate restocking +50 units"
                        >
                          <Plus className="w-3.5 h-3.5" /> +50
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Categories Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base font-heading mb-1">
              Browse Inventory by Category
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Click a therapeutic category to view its medicines in the inventory table
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <button
                  key={cat}
                  onClick={() => {
                    onFilterCategory(cat);
                    onNavigateTab('inventory');
                  }}
                  className="p-3 text-left rounded-xl bg-slate-50/80 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200/80 transition-all cursor-pointer group"
                >
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-emerald-900 line-clamp-1">
                    {cat}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1 flex justify-between items-center">
                    <span>{count} medicines</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Billing Invoices & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Billing Launch Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-md shadow-emerald-700/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                Quick Counter
              </span>
              <Receipt className="w-5 h-5 text-emerald-200" />
            </div>
            <h4 className="text-lg font-bold mt-2 font-heading">
              New Customer Bill (POS)
            </h4>
            <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
              Launch billing counter with automatic tax calculations, discounts, and printable GST invoice.
            </p>
            <button
              onClick={() => onNavigateTab('billing')}
              className="mt-4 w-full py-2.5 bg-white text-emerald-800 font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Open Billing Counter <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Invoices List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-slate-500" />
                Recent Invoices
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {recentBills.length} total
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentBills.slice(0, 4).map((bill) => (
                <div
                  key={bill.billId}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => onViewBillReceipt(bill)}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800 font-mono">
                      {bill.billId}
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">
                      {bill.customerName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {bill.date} • {bill.paymentMode}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-slate-900 font-mono">
                      ₹{bill.grandTotal.toFixed(2)}
                    </span>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                      View Receipt →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pharmacy Regulatory Compliance Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600">
            <div className="font-bold text-slate-800 font-heading mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Good Pharmacy Practice (GPP) Standards
            </div>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Cold chain storage verified (2°C - 8°C maintained)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Schedule H / H1 registers maintained with Doctor MCI ID</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Automated batch expiry quarantine active</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
