import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  User, 
  Phone, 
  CreditCard,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';
import { Medicine, BillItem, BillReceipt } from '../types/pharmacy';

interface BillingViewProps {
  medicines: Medicine[];
  onCompleteBill: (receipt: BillReceipt) => void;
  selectedPreFillMedicine?: Medicine | null;
  onClearPreFill?: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  medicines,
  onCompleteBill,
  selectedPreFillMedicine,
  onClearPreFill,
}) => {
  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Net Banking'>('Cash');

  // Cart
  const [cartItems, setCartItems] = useState<BillItem[]>([]);

  // Item selector
  const [selectedMedId, setSelectedMedId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Handle medicine prefill if navigated from Inventory
  useEffect(() => {
    if (selectedPreFillMedicine) {
      setSelectedMedId(selectedPreFillMedicine.id);
      setQuantity(1);
      if (onClearPreFill) onClearPreFill();
    }
  }, [selectedPreFillMedicine]);

  const currentMed = medicines.find((m) => m.id === selectedMedId);

  // Add Item to Bill
  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentMed) {
      setErrorMessage('Please select a medicine from the list.');
      return;
    }

    if (quantity <= 0) {
      setErrorMessage('Quantity must be at least 1.');
      return;
    }

    // Check if available stock
    const existingInCart = cartItems.find((item) => item.medicineId === currentMed.id);
    const alreadyInCartQty = existingInCart ? existingInCart.quantity : 0;
    const totalRequested = alreadyInCartQty + quantity;

    if (totalRequested > currentMed.quantity) {
      setErrorMessage(
        `Insufficient stock for "${currentMed.name}". Available: ${currentMed.quantity}, already in bill: ${alreadyInCartQty}`
      );
      return;
    }

    if (existingInCart) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.medicineId === currentMed.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                total: (item.quantity + quantity) * item.unitPrice,
              }
            : item
        )
      );
    } else {
      const newItem: BillItem = {
        medicineId: currentMed.id,
        medicineName: currentMed.name,
        batchNo: currentMed.batchNo,
        dosageForm: currentMed.dosageForm,
        unitPrice: currentMed.unitPrice,
        quantity,
        total: quantity * currentMed.unitPrice,
      };
      setCartItems((prev) => [...prev, newItem]);
    }

    // Reset selector quantity
    setQuantity(1);
  };

  // Remove from bill
  const handleRemoveItem = (medId: string) => {
    setCartItems((prev) => prev.filter((item) => item.medicineId !== medId));
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const taxRate = 0.05; // 5% GST
  const taxAmount = Number((subtotal * taxRate).toFixed(2));
  const grandTotal = Number((subtotal + taxAmount).toFixed(2));

  // Complete Sale
  const handleCompleteSale = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage('Please add at least one medicine to the bill.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter the customer name.');
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newReceipt: BillReceipt = {
      billId: `INV-${Date.now().toString().slice(-4)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || 'N/A',
      date: dateStr,
      time: timeStr,
      items: cartItems,
      subtotal,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 5,
      taxAmount,
      grandTotal,
      paymentMode,
    };

    onCompleteBill(newReceipt);

    // Reset Form
    setCartItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setSelectedMedId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            <span>Pharmacy Counter Billing (POS)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Create customer invoices, compute subtotal &amp; GST, update stock, and print receipts.
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={() => setCartItems([])}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
          >
            Clear Current Bill
          </button>
        )}
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div 
          role="alert" 
          className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-center gap-2 animate-fade-in"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Select Medicine Form & Customer Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Add Medicine to Bill */}
          <section aria-labelledby="add-item-heading" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 id="add-item-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Select Medicine to Sell</span>
            </h3>

            <form onSubmit={handleAddToCart} className="space-y-3">
              <div>
                <label htmlFor="med-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose Medicine *
                </label>
                <select
                  id="med-select"
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Choose from inventory ({medicines.length}) --</option>
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.quantity === 0}>
                      {m.name} ({m.strength}) - ₹{m.unitPrice.toFixed(2)} [Stock: {m.quantity}]
                      {m.quantity === 0 ? ' (OUT OF STOCK)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {currentMed && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Generic:</span>
                    <span className="font-semibold text-slate-800">{currentMed.genericName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Available Stock:</span>
                    <span className={`font-bold ${currentMed.quantity <= currentMed.minAlertLevel ? 'text-amber-600' : 'text-emerald-700'}`}>
                      {currentMed.quantity} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Price:</span>
                    <span className="font-bold text-slate-800">₹{currentMed.unitPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label htmlFor="qty-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    id="qty-input"
                    type="number"
                    min="1"
                    max={currentMed ? currentMed.quantity : 999}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!currentMed || currentMed.quantity === 0}
                  className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm disabled:opacity-40 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Bill</span>
                </button>
              </div>
            </form>
          </section>

          {/* 2. Customer Details */}
          <section aria-labelledby="customer-info-heading" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 id="customer-info-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Customer Information</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label htmlFor="customer-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer / Patient Name *
                </label>
                <input
                  id="customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="payment-mode" className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  id="payment-mode"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Cash">Cash Counter</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Current Bill Items & Checkout Summary (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <section aria-labelledby="bill-items-heading" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 id="bill-items-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
                Current Bill Items ({cartItems.length})
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        <ShoppingBag className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                        <p className="text-sm font-medium">No items added to bill yet</p>
                        <p className="text-xs">Select a medicine on the left and click "Add to Bill".</p>
                      </td>
                    </tr>
                  ) : (
                    cartItems.map((item) => (
                      <tr key={item.medicineId} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {item.medicineName}
                          <span className="block text-[11px] text-slate-400 font-normal">
                            Batch: {item.batchNo}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          ₹{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-emerald-800">
                          ₹{item.total.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.medicineId)}
                            title="Remove item"
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculations Box */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST Tax (5%):</span>
                <span className="font-semibold text-slate-900">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Grand Total:</span>
                <span className="text-emerald-700 text-xl font-heading">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action to complete */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleCompleteSale}
                disabled={cartItems.length === 0 || !customerName.trim()}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                <Printer className="w-5 h-5" />
                <span>Complete Sale &amp; Print Bill</span>
              </button>
              {cartItems.length > 0 && !customerName.trim() && (
                <p className="text-xs text-amber-700 text-center mt-2 font-medium">
                  * Please enter customer name on the left to complete the sale.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
