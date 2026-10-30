import React, { useState } from 'react';
import { History, Receipt, Search, Eye, Calendar, Printer } from 'lucide-react';
import { BillReceipt } from '../types/pharmacy';

interface SalesHistoryViewProps {
  sales: BillReceipt[];
  onViewReceipt: (receipt: BillReceipt) => void;
  onNavigateToBilling: () => void;
}

export const SalesHistoryView: React.FC<SalesHistoryViewProps> = ({
  sales,
  onViewReceipt,
  onNavigateToBilling,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter((sale) => {
    return (
      sale.billId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.paymentMode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalSalesRevenue = sales.reduce((sum, s) => sum + s.grandTotal, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <History className="w-6 h-6 text-purple-600" />
            <span>Sales History &amp; Receipts</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            View past pharmacy sales transactions and reprint customer invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-purple-50 rounded-xl border border-purple-200 text-xs font-semibold text-purple-900">
            <span>Total Revenue: </span>
            <span className="text-sm font-bold text-purple-800">₹{totalSalesRevenue.toFixed(2)}</span>
          </div>

          <button
            type="button"
            onClick={onNavigateToBilling}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Receipt className="w-4 h-4" />
            <span>+ New Bill</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sales by Invoice ID (e.g. INV-1001), Customer name..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Date &amp; Time</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items Count</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">No sales records found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Complete a sale from the Billing tab to generate records.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.billId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {sale.billId}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      <div className="font-medium text-slate-700">{sale.date}</div>
                      <div>{sale.time}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{sale.customerName}</div>
                      <div className="text-xs text-slate-400 font-normal">{sale.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="font-semibold text-slate-900">{sale.items.length}</span> item(s)
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {sale.paymentMode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700 font-heading text-base">
                      ₹{sale.grandTotal.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onViewReceipt(sale)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 text-slate-700 text-xs font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View / Print</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
