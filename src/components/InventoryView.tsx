import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle, 
  X,
  ShoppingCart,
  Pill,
  Minus,
  Check
} from 'lucide-react';
import { Medicine, CategoryType, DosageFormType } from '../types/pharmacy';

interface InventoryViewProps {
  medicines: Medicine[];
  categories: string[];
  onAddMedicine: (medicine: Medicine) => void;
  onEditMedicine: (medicine: Medicine) => void;
  onDeleteMedicine: (id: string) => void;
  onUpdateStock: (id: string, newQuantity: number) => void;
  onSelectForBilling: (medicine: Medicine) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  medicines,
  categories,
  onAddMedicine,
  onEditMedicine,
  onDeleteMedicine,
  onUpdateStock,
  onSelectForBilling,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Modal State for Add / Edit Medicine
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Analgesics & Pain Relief');
  const [dosageForm, setDosageForm] = useState<DosageFormType>('Tablet');
  const [strength, setStrength] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(50);
  const [minAlertLevel, setMinAlertLevel] = useState<number>(15);
  const [batchNo, setBatchNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [manufacturer, setManufacturer] = useState('');

  // Quick feedback toast
  const [successToast, setSuccessToast] = useState<string>('');

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingId(null);
    setName('');
    setGenericName('');
    setCategory(categories[0] || 'Analgesics & Pain Relief');
    setDosageForm('Tablet');
    setStrength('500mg');
    setUnitPrice(10);
    setQuantity(50);
    setMinAlertLevel(15);
    setBatchNo(`BAT-${Math.floor(1000 + Math.random() * 9000)}`);
    setExpiryDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setManufacturer('HealthCare Pharma');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (med: Medicine) => {
    setEditingId(med.id);
    setName(med.name);
    setGenericName(med.genericName);
    setCategory(med.category);
    setDosageForm(med.dosageForm);
    setStrength(med.strength);
    setUnitPrice(med.unitPrice);
    setQuantity(med.quantity);
    setMinAlertLevel(med.minAlertLevel);
    setBatchNo(med.batchNo);
    setExpiryDate(med.expiryDate);
    setManufacturer(med.manufacturer);
    setIsModalOpen(true);
  };

  // Save Add/Edit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      // Edit
      const updated: Medicine = {
        id: editingId,
        name: name.trim(),
        genericName: genericName.trim() || name.trim(),
        category,
        dosageForm,
        strength: strength.trim() || 'Standard',
        unitPrice: Number(unitPrice) || 1,
        quantity: Math.max(0, Number(quantity) || 0),
        minAlertLevel: Number(minAlertLevel) || 10,
        batchNo: batchNo.trim() || 'BATCH-01',
        expiryDate: expiryDate || '2027-12-31',
        rackLocation: 'Shelf 1',
        manufacturer: manufacturer.trim() || 'Standard Pharma',
        requiresPrescription: false,
      };
      onEditMedicine(updated);
      showToast(`Updated "${updated.name}" successfully!`);
    } else {
      // Add
      const newMed: Medicine = {
        id: `MED-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        genericName: genericName.trim() || name.trim(),
        category,
        dosageForm,
        strength: strength.trim() || 'Standard',
        unitPrice: Number(unitPrice) || 1,
        quantity: Math.max(0, Number(quantity) || 0),
        minAlertLevel: Number(minAlertLevel) || 10,
        batchNo: batchNo.trim() || `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
        expiryDate: expiryDate || '2027-12-31',
        rackLocation: 'Shelf 1',
        manufacturer: manufacturer.trim() || 'Standard Pharma',
        requiresPrescription: false,
      };
      onAddMedicine(newMed);
      showToast(`Added "${newMed.name}" to inventory!`);
    }

    setIsModalOpen(false);
  };

  // Quick Stock adjustment (+1 / -1)
  const handleQuickStockChange = (med: Medicine, delta: number) => {
    const newQty = Math.max(0, med.quantity + delta);
    onUpdateStock(med.id, newQty);
  };

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = !selectedCategory || m.category === selectedCategory;

      let matchStock = true;
      if (stockFilter === 'in_stock') matchStock = m.quantity > m.minAlertLevel;
      if (stockFilter === 'low_stock') matchStock = m.quantity > 0 && m.quantity <= m.minAlertLevel;
      if (stockFilter === 'out_of_stock') matchStock = m.quantity === 0;

      return matchSearch && matchCategory && matchStock;
    });
  }, [medicines, searchTerm, selectedCategory, stockFilter]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold animate-fade-in"
        >
          <Check className="w-5 h-5 text-emerald-200" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Pill className="w-6 h-6 text-emerald-600" />
            <span>Medicines &amp; Stock Inventory</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            View medicine catalog, update shelf stock, add new medications, and sell items.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add New Medicine</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <label htmlFor="med-search" className="sr-only">Search medicines</label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="med-search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by medicine name, generic formula..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <label htmlFor="cat-filter" className="sr-only">Filter by category</label>
          <select
            id="cat-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories ({medicines.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Filter */}
        <div className="sm:col-span-3">
          <label htmlFor="stock-filter" className="sr-only">Filter by stock status</label>
          <select
            id="stock-filter"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Stock Levels</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock (≤ Alert Level)</option>
            <option value="out_of_stock">Out of Stock (0 units)</option>
          </select>
        </div>
      </div>

      {/* Medicines Table (Semantic HTML table from Unit II) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="py-3.5 px-4">Medicine &amp; Details</th>
                <th scope="col" className="py-3.5 px-4">Category</th>
                <th scope="col" className="py-3.5 px-4">Price</th>
                <th scope="col" className="py-3.5 px-4 text-center">Stock Quantity</th>
                <th scope="col" className="py-3.5 px-4">Status</th>
                <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No medicines found</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search query or add a new medicine.</p>
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const isOutOfStock = med.quantity === 0;
                  const isLowStock = !isOutOfStock && med.quantity <= med.minAlertLevel;

                  return (
                    <tr 
                      key={med.id} 
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isOutOfStock ? 'bg-rose-50/30' : isLowStock ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Name & Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{med.name}</span>
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {med.strength}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {med.genericName} • {med.dosageForm} • Batch: {med.batchNo}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {med.category}
                        </span>
                      </td>

                      {/* Unit Price */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        ₹{med.unitPrice.toFixed(2)}
                      </td>

                      {/* Stock Quantity with Quick +/- Buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center space-x-1.5 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleQuickStockChange(med, -1)}
                            disabled={med.quantity === 0}
                            title="Decrease stock by 1"
                            className="w-6 h-6 rounded-md bg-white hover:bg-rose-100 text-slate-600 hover:text-rose-700 flex items-center justify-center font-bold text-xs disabled:opacity-40 cursor-pointer shadow-2xs transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <span className={`w-10 text-center font-bold text-sm ${
                            isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-700' : 'text-slate-900'
                          }`}>
                            {med.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleQuickStockChange(med, 1)}
                            title="Increase stock by 1"
                            className="w-6 h-6 rounded-md bg-white hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Low Stock ({med.quantity})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            In Stock
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Bill button */}
                          <button
                            type="button"
                            onClick={() => onSelectForBilling(med)}
                            disabled={isOutOfStock}
                            title="Sell / Add this medicine to billing"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1 disabled:opacity-40 cursor-pointer transition-colors shadow-2xs"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Bill</span>
                          </button>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(med)}
                            title="Edit medicine details"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${med.name}" from inventory?`)) {
                                onDeleteMedicine(med.id);
                                showToast(`Deleted "${med.name}"`);
                              }
                            }}
                            title="Delete medicine"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 hover:border-rose-200 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 id="modal-title" className="text-lg font-bold text-slate-900 font-heading">
                {editingId ? 'Edit Medicine Details' : '+ Add New Medicine'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Brand Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="med-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Medicine Brand Name *
                  </label>
                  <input
                    id="med-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dolo 650, Augmentin 625"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Generic Name */}
                <div>
                  <label htmlFor="generic-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Generic Formula
                  </label>
                  <input
                    id="generic-name"
                    type="text"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    placeholder="e.g. Paracetamol"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category-select" className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Dosage Form */}
                <div>
                  <label htmlFor="dosage-select" className="block text-xs font-semibold text-slate-700 mb-1">
                    Dosage Form
                  </label>
                  <select
                    id="dosage-select"
                    value={dosageForm}
                    onChange={(e) => setDosageForm(e.target.value as DosageFormType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Eye Drops">Eye Drops</option>
                  </select>
                </div>

                {/* Strength */}
                <div>
                  <label htmlFor="strength-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Strength / Volume
                  </label>
                  <input
                    id="strength-input"
                    type="text"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    placeholder="e.g. 650mg, 100ml"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit Price (₹) *
                  </label>
                  <input
                    id="price-input"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label htmlFor="stock-qty" className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Stock Units *
                  </label>
                  <input
                    id="stock-qty"
                    type="number"
                    min="0"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Batch No */}
                <div>
                  <label htmlFor="batch-no" className="block text-xs font-semibold text-slate-700 mb-1">
                    Batch Number
                  </label>
                  <input
                    id="batch-no"
                    type="text"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    placeholder="e.g. DL-8849"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label htmlFor="expiry-date" className="block text-xs font-semibold text-slate-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    id="expiry-date"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Manufacturer */}
                <div className="sm:col-span-2">
                  <label htmlFor="manufacturer-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Manufacturer / Pharmaceutical Co.
                  </label>
                  <input
                    id="manufacturer-input"
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="e.g. Micro Labs, Cipla, Sun Pharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
