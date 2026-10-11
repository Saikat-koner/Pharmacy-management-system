import React from 'react';
import { BillReceipt } from '../types/pharmacy';
import { Printer, X, CheckCircle, ShieldCheck, HeartPulse } from 'lucide-react';

interface InvoiceReceiptModalProps {
  receipt: BillReceipt | null;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  receipt,
  onClose,
}) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Toolbar (hidden during print) */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-800 text-sm font-heading">
              Invoice Generated Successfully ({receipt.billId})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Invoice Container */}
        <div id="printable-receipt" className="p-8 space-y-6 text-slate-800 font-sans">
          {/* Pharmacy Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 font-heading">
                PHARMACARE CHEMISTS & DRUGGISTS
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Retail Pharmacy & Healthcare Solutions • 24x7 Emergency Dispensing
              </p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Reg. Address: 42, Health Avenue, Medical Complex, Pin: 560029
              </p>
              <div className="text-[11px] text-slate-500 font-mono flex gap-4 mt-1">
                <span>D.L. No: <strong>DL-20B/44910, 21B/44911</strong></span>
                <span>GSTIN: <strong>27AAACF8891P1ZV</strong></span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded font-bold text-xs uppercase font-mono">
                Tax Invoice / Cash Memo
              </span>
              <div className="text-xs text-slate-500 font-mono mt-2">
                Ph: +91 98450 99882
              </div>
            </div>
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <div><span className="text-slate-500">Invoice No:</span> <strong className="font-mono">{receipt.billId}</strong></div>
              <div><span className="text-slate-500">Date & Time:</span> <span className="font-mono">{receipt.date} {receipt.time}</span></div>
              <div><span className="text-slate-500">Payment:</span> <span className="font-semibold">{receipt.paymentMode}</span></div>
            </div>
            <div>
              <div><span className="text-slate-500">Customer Name:</span> <strong>{receipt.customerName}</strong></div>
              <div><span className="text-slate-500">Phone:</span> <span className="font-mono">{receipt.customerPhone}</span></div>
              {receipt.doctorName && (
                <div><span className="text-slate-500">Doctor / Clinic:</span> <span>{receipt.doctorName}</span></div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                <th className="py-2 px-1">#</th>
                <th className="py-2 px-1">Particulars / Medicine</th>
                <th className="py-2 px-1">Batch</th>
                <th className="py-2 px-1 text-center">Qty</th>
                <th className="py-2 px-1 text-right">Rate (₹)</th>
                <th className="py-2 px-1 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {receipt.items.map((item, index) => (
                <tr key={index} className="py-2">
                  <td className="py-2 px-1 text-slate-500">{index + 1}</td>
                  <td className="py-2 px-1 font-sans">
                    <span className="font-bold text-slate-900">{item.medicineName}</span>
                    <span className="text-slate-500 text-[11px] ml-1">({item.dosageForm})</span>
                  </td>
                  <td className="py-2 px-1 text-slate-600">{item.batchNo}</td>
                  <td className="py-2 px-1 text-center font-bold">{item.quantity}</td>
                  <td className="py-2 px-1 text-right">{item.unitPrice.toFixed(2)}</td>
                  <td className="py-2 px-1 text-right font-bold text-slate-900">{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Calculation Summary */}
          <div className="border-t-2 border-slate-800 pt-3 flex justify-between items-start text-xs font-mono">
            <div className="max-w-xs text-[11px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-700 uppercase">Terms & Conditions:</p>
              <p>1. Check batch number and expiry before accepting goods.</p>
              <p>2. Goods once sold cannot be returned without original cash memo.</p>
              <p>3. Store in cool, dry & dark place away from children.</p>
            </div>

            <div className="w-56 space-y-1.5 text-right">
              <div className="flex justify-between">
                <span className="text-slate-500">Sub Total:</span>
                <span>₹{receipt.subtotal.toFixed(2)}</span>
              </div>
              {receipt.discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({receipt.discountPercent}%):</span>
                  <span>- ₹{receipt.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST Tax ({receipt.taxPercent}%):</span>
                <span>+ ₹{receipt.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-base font-bold text-slate-900">
                <span>Grand Total:</span>
                <span className="text-emerald-900">₹{receipt.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signatures */}
          <div className="pt-8 border-t border-dashed border-slate-300 flex justify-between items-end text-xs">
            <div className="text-[11px] text-slate-400 font-mono">
              Computer Generated Invoice • CSE326 Academic Submission
            </div>
            <div className="text-center">
              <div className="border-t border-slate-400 w-44 pt-1 font-semibold text-slate-700">
                Registered Pharmacist
              </div>
              <div className="text-[10px] text-slate-400 font-mono">License Reg: PH-29801</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
