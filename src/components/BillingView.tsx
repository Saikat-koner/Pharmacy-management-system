import React, { useState } from 'react';
import { Medicine, BillItem, BillReceipt } from '../types/pharmacy';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Printer, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  User, 
  Phone, 
  CreditCard,
  Percent,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

interface BillingViewProps {
  medicines: Medicine[];
  onCompleteBill: (receipt: BillReceipt) => void;
  onViewReceiptModal: (receipt: BillReceipt) => void;
  pendingRxPrefill?: {
    patientName: string;
    doctorName: string;
    items: { medicineName: string; qty: number }[];
  } | null;
  onClearPendingPrefill?: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  medicines,
  onCompleteBill,
  onViewReceiptModal,
  pendingRxPrefill,
  onClearPendingPrefill,
}) => {
  // Customer details
  const [customerName, setCustomerName] = useState(pendingRxPrefill?.patientName || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [doctorName, setDoctorName] = useState(pendingRxPrefill?.doctorName || '');
  
  // Cart items
  const [cartItems, setCartItems] = useState<BillItem[]>([]);
  
  // Selected medicine for adding
  const [selectedMedId, setSelectedMedId] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  
  // Pricing modifiers
  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [taxPercent, setTaxPercent] = useState<number>(5); // 5% GST standard on medicines
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Net Banking'>('UPI');

  // Error feedback
  const [formError, setFormError] = useState<string>('');

  // Currently selected medicine object
  const currentSelectedMed = medicines.find((m) => m.id === selectedMedId);

  // Handle adding item to cart
  const handleAddItem = () => {
    setFormError('');
    if (!currentSelectedMed) {
      setFormError('Please select a medicine first.');
      return;
    }

    if (itemQuantity <= 0) {
      setFormError('Quantity must be at least 1.');
      return;
    }

    if (itemQuantity > currentSelectedMed.quantity) {
      setFormError(`Only ${currentSelectedMed.quantity} units are available in stock.`);
      return;
    }

    // Check if already in cart
    const existingIndex = cartItems.findIndex((item) => item.medicineId === currentSelectedMed.id);

    if (existingIndex > -1) {
      const existing = cartItems[existingIndex];
      const newTotalQty = existing.quantity + itemQuantity;
      if (newTotalQty > currentSelectedMed.quantity) {
        setFormError(`Cannot add more. Max stock available is ${currentSelectedMed.quantity}.`);
        return;
      }
      const updated = [...cartItems];
      updated[existingIndex] = {
        ...existing,
        quantity: newTotalQty,
        total: newTotalQty * existing.unitPrice,
      };
      setCartItems(updated);
    } else {
      const newItem: BillItem = {
        medicineId: currentSelectedMed.id,
        medicineName: `${currentSelectedMed.name} (${currentSelectedMed.strength})`,
        batchNo: currentSelectedMed.batchNo,
        dosageForm: currentSelectedMed.dosageForm,
        unitPrice: currentSelectedMed.unitPrice,
        quantity: itemQuantity,
        total: itemQuantity * currentSelectedMed.unitPrice,
      };
      setCartItems([...cartItems, newItem]);
    }

    // Reset item selector
    setSelectedMedId('');
    setItemQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleUpdateItemQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }

    const item = cartItems[index];
    const med = medicines.find((m) => m.id === item.medicineId);
    if (med && newQty > med.quantity) {
      alert(`Available stock for ${med.name} is only ${med.quantity}.`);
      return;
    }

    const updated = [...cartItems];
    updated[index] = {
      ...item,
      quantity: newQty,
      total: newQty * item.unitPrice,
    };
    setCartItems(updated);
  };

  // Math Calculations (Unit 3 client-side calculation logic)
  const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const grandTotal = taxableAmount + taxAmount;

  // Process and finalize the bill
  const handleFinalizeBill = () => {
    setFormError('');

    if (!customerName.trim()) {
      setFormError('Please enter Customer Name.');
      return;
    }

    if (customerPhone.trim() && !/^\d{10}$/.test(customerPhone.trim())) {
      setFormError('Please enter a valid 10-digit phone number or leave blank.');
      return;
    }

    if (cartItems.length === 0) {
      setFormError('Cart is empty. Add at least one medicine to generate bill.');
      return;
    }

    // Check if any prescription medicine requires doctor's name
    const hasRxItem = cartItems.some((item) => {
      const med = medicines.find((m) => m.id === item.medicineId);
      return med?.requiresPrescription;
    });

    if (hasRxItem && !doctorName.trim()) {
      setFormError('Prescription medicine included in bill. Prescribing Doctor Name is required.');
      return;
    }

    const now = new Date();
    const receipt: BillReceipt = {
      billId: `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || 'N/A',
      doctorName: doctorName.trim() || undefined,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...cartItems],
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      grandTotal,
      paymentMode,
    };

    onCompleteBill(receipt);
    onViewReceiptModal(receipt);

    // Reset bill state
    setCartItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setDoctorName('');
    if (onClearPendingPrefill) onClearPendingPrefill();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            Point of Sale (POS) Billing Counter
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatic real-time line totals, discounts, GST calculation, and printable tax invoice generator.
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={() => setCartItems([])}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer self-start sm:self-center"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear Current Bill
          </button>
        )}
      </div>

      {pendingRxPrefill && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs text-teal-800 flex items-center justify-between">
          <span>
            Prefilled from Prescription: <strong>{pendingRxPrefill.patientName}</strong> (Doctor: {pendingRxPrefill.doctorName})
          </span>
          <button
            onClick={onClearPendingPrefill}
            className="text-teal-900 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {formError && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Form & Item Selector */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Details Form (Unit 1 HTML Form) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-emerald-600" />
              1. Customer & Patient Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer / Patient Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number (10 digits)
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prescribing Doctor Name (Required for Rx medicines)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. A. K. Sen, MD"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Add Medicine to Bill */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              2. Add Medicines to Invoice
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Medicine from Inventory
                </label>
                <select
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">-- Choose a medicine to add --</option>
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.quantity === 0}>
                      {m.name} ({m.strength}) • {m.batchNo} • Stock: {m.quantity} • ₹{m.unitPrice.toFixed(2)}
                      {m.quantity === 0 ? ' [OUT OF STOCK]' : ''}
                      {m.requiresPrescription ? ' [Rx]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {currentSelectedMed && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800">{currentSelectedMed.genericName}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-slate-600 font-mono">Location: {currentSelectedMed.rackLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-800 font-mono">
                      Rate: ₹{currentSelectedMed.unitPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      {currentSelectedMed.quantity} available
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-32">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={currentSelectedMed ? currentSelectedMed.quantity : 100}
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="flex-1 pt-5">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!selectedMedId}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs ${
                      !selectedMedId
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                    }`}
                  >
                    <Plus className="w-4 h-4" /> Add Line Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Invoice Cart & Financial Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Invoice Summary ({cartItems.length} items)
              </h3>
              <span className="text-xs font-mono text-slate-400">
                GST Registered
              </span>
            </div>

            {/* Cart Items Table */}
            <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 text-xs">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                  No items in bill yet. Select a medicine and click "Add Line Item".
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 font-heading">
                        {item.medicineName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Batch: {item.batchNo} • ₹{item.unitPrice.toFixed(2)} ea
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItemQty(idx, parseInt(e.target.value) || 0)}
                        className="w-12 px-1.5 py-1 text-center bg-slate-100 border border-slate-200 rounded font-mono font-bold text-xs"
                      />
                      <div className="font-mono font-bold text-slate-900 min-w-16 text-right">
                        ₹{item.total.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discount and Tax Controls */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <Percent className="w-3 h-3 text-emerald-600" />
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    GST / Tax Rate (%)
                  </label>
                  <select
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  >
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5% (Essential Meds)</option>
                    <option value="12">12% (Standard Pharma)</option>
                    <option value="18">18% (Supplements/Cosmetic)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Payment Mode
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
                  {(['Cash', 'UPI', 'Card', 'Net Banking'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                        paymentMode === mode
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 font-mono text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({discountPercent}%):</span>
                <span>- ₹{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST Tax ({taxPercent}%):</span>
                <span>+ ₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-bold text-slate-900 font-heading">
                <span>Grand Total:</span>
                <span className="text-emerald-700 font-mono">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleFinalizeBill}
              disabled={cartItems.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
                cartItems.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              }`}
            >
              <Printer className="w-4 h-4" /> Generate & Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
