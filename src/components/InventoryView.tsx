import React, { useState, useMemo } from 'react';
import { Medicine, CategoryType, DosageFormType } from '../types/pharmacy';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  ShoppingCart, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  X,
  Package,
  Check,
  ShieldAlert,
  Layers
} from 'lucide-react';

interface InventoryViewProps {
  medicines: Medicine[];
  categories: string[];
  onAddMedicineClick: () => void;
  onDeleteMedicine: (id: string) => void;
  onUpdateStock: (id: string, newQuantity: number) => void;
  onEditMedicine?: (med: Medicine) => void;
  onAddToBill: (medicine: Medicine) => void;
  initialCategoryFilter?: string;
  isCustomerView?: boolean;
}

type SortField = 'name' | 'quantity' | 'unitPrice' | 'expiryDate';
type SortOrder = 'asc' | 'desc';

export const InventoryView: React.FC<InventoryViewProps> = ({
  medicines,
  categories,
  onAddMedicineClick,
  onDeleteMedicine,
  onUpdateStock,
  onEditMedicine,
  onAddToBill,
  initialCategoryFilter = '',
  isCustomerView = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter);
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Quick edit stock modal state
  const [stockModalMed, setStockModalMed] = useState<Medicine | null>(null);
  const [editQtyValue, setEditQtyValue] = useState<number>(0);

  // Full edit medicine modal state
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [editName, setEditName] = useState('');
  const [editGeneric, setEditGeneric] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDosage, setEditDosage] = useState<DosageFormType>('Tablet');
  const [editStrength, setEditStrength] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editBatch, setEditBatch] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editMinAlert, setEditMinAlert] = useState<number>(10);
  const [editRack, setEditRack] = useState('');
  const [editManufacturer, setEditManufacturer] = useState('');
  const [editRequiresRx, setEditRequiresRx] = useState(false);

  // Filtered and sorted medicines
  const filteredMedicines = useMemo(() => {
    return medicines
      .filter((med) => {
        const matchSearch =
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.rackLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchCategory = !selectedCategory || med.category === selectedCategory;

        let matchStock = true;
        if (stockFilter === 'in_stock') {
          matchStock = med.quantity > med.minAlertLevel;
        } else if (stockFilter === 'low_stock') {
          matchStock = med.quantity > 0 && med.quantity <= med.minAlertLevel;
        } else if (stockFilter === 'out_of_stock') {
          matchStock = med.quantity === 0;
        }

        return matchSearch && matchCategory && matchStock;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'name') {
          cmp = a.name.localeCompare(b.name);
        } else if (sortField === 'quantity') {
          cmp = a.quantity - b.quantity;
        } else if (sortField === 'unitPrice') {
          cmp = a.unitPrice - b.unitPrice;
        } else if (sortField === 'expiryDate') {
          cmp = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [medicines, searchTerm, selectedCategory, stockFilter, sortField, sortOrder]);

  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Medicine ID',
      'Name',
      'Generic Name',
      'Strength',
      'Category',
      'Dosage Form',
      'Batch No',
      'Expiry Date',
      'Stock Qty',
      'Unit Price',
      'Rack Location',
      'Prescription Req'
    ];

    const rows = filteredMedicines.map((m) => [
      m.id,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.genericName.replace(/"/g, '""')}"`,
      m.strength,
      `"${m.category}"`,
      m.dosageForm,
      m.batchNo,
      m.expiryDate,
      m.quantity,
      m.unitPrice.toFixed(2),
      m.rackLocation,
      m.requiresPrescription ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pharmacy_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openStockModal = (med: Medicine) => {
    setStockModalMed(med);
    setEditQtyValue(med.quantity);
  };

  const handleStockSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockModalMed) {
      onUpdateStock(stockModalMed.id, editQtyValue);
      setStockModalMed(null);
    }
  };

  const openFullEditModal = (med: Medicine) => {
    setEditingMedicine(med);
    setEditName(med.name);
    setEditGeneric(med.genericName);
    setEditCategory(med.category);
    setEditDosage(med.dosageForm);
    setEditStrength(med.strength);
    setEditPrice(med.unitPrice);
    setEditBatch(med.batchNo);
    setEditExpiry(med.expiryDate);
    setEditQuantity(med.quantity);
    setEditMinAlert(med.minAlertLevel);
    setEditRack(med.rackLocation);
    setEditManufacturer(med.manufacturer);
    setEditRequiresRx(med.requiresPrescription);
  };

  const handleFullEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedicine || !onEditMedicine) return;

    const updated: Medicine = {
      ...editingMedicine,
      name: editName.trim(),
      genericName: editGeneric.trim(),
      category: editCategory,
      dosageForm: editDosage,
      strength: editStrength.trim(),
      unitPrice: Number(editPrice),
      batchNo: editBatch.trim(),
      expiryDate: editExpiry,
      quantity: Number(editQuantity),
      minAlertLevel: Number(editMinAlert),
      rackLocation: editRack.trim(),
      manufacturer: editManufacturer.trim(),
      requiresPrescription: editRequiresRx,
    };

    onEditMedicine(updated);
    setEditingMedicine(null);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            {isCustomerView ? 'Medicines Catalog & Stock Availability' : 'Medicine Inventory & Stock Management'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isCustomerView
              ? 'Browse genuine pharmaceutical medicines, check strengths, therapeutic categories, and pricing.'
              : 'Complete pharmaceutical database with live batch tracking, stock levels, and administrative editing.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download CSV Table"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {!isCustomerView && (
            <button
              onClick={onAddMedicineClick}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Medicine</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brand name, generic salt, batch, rack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Therapeutic Category Selector */}
          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="">All Therapeutic Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter Pills */}
          <div className="sm:col-span-3">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock (&gt; Min Level)</option>
              <option value="low_stock">Low Stock (Needs Reorder)</option>
              <option value="out_of_stock">Out of Stock (0 Units)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        {(searchTerm || selectedCategory || stockFilter !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-medium">Active filters:</span>
            {selectedCategory && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-semibold">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:text-emerald-950 p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1">
                Query: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-slate-950 p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setStockFilter('all');
              }}
              className="text-xs text-rose-600 hover:underline font-semibold ml-2 cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Semantic Structured HTML Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="text-xs text-slate-500 p-3 bg-slate-50 border-b border-slate-100 text-left font-mono">
              PharmaCare Active Inventory Registry • {filteredMedicines.length} Medicines Loaded
            </caption>
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th scope="col" className="py-3 px-4">
                  <button onClick={() => handleSortToggle('name')} className="flex items-center gap-1 hover:text-slate-900 cursor-pointer">
                    <span>Medicine / Brand</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-4">Therapeutic Category</th>
                <th scope="col" className="py-3 px-4">Dosage &amp; Strength</th>
                <th scope="col" className="py-3 px-4">Batch No</th>
                <th scope="col" className="py-3 px-4">
                  <button onClick={() => handleSortToggle('expiryDate')} className="flex items-center gap-1 hover:text-slate-900 cursor-pointer">
                    <span>Expiry</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-4">
                  <button onClick={() => handleSortToggle('unitPrice')} className="flex items-center gap-1 hover:text-slate-900 cursor-pointer">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-4">
                  <button onClick={() => handleSortToggle('quantity')} className="flex items-center gap-1 hover:text-slate-900 cursor-pointer">
                    <span>Stock Level</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                {!isCustomerView && (
                  <th scope="col" className="py-3 px-4">Rack Location</th>
                )}
                <th scope="col" className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No medicines match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const isOutOfStock = med.quantity === 0;
                  const isLowStock = med.quantity > 0 && med.quantity <= med.minAlertLevel;

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm font-heading">
                          {med.name}
                        </div>
                        <div className="text-slate-500 text-[11px] font-sans">
                          {med.genericName}
                        </div>
                        {med.requiresPrescription && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 mt-1">
                            <ShieldAlert className="w-2.5 h-2.5" /> Rx Required
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 inline-block">
                          {med.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {med.dosageForm} • <span className="font-mono text-slate-800">{med.strength}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 text-xs">
                        {med.batchNo}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className={new Date(med.expiryDate) < new Date('2026-12-31') ? 'text-amber-700 font-bold' : 'text-slate-600'}>
                          {med.expiryDate}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs sm:text-sm">
                        ₹{med.unitPrice.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          ></span>
                          <span className="font-bold text-slate-800">{med.quantity}</span>
                          <span className="text-[11px] text-slate-400">units</span>
                        </div>
                        {isLowStock && (
                          <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Low Stock</span>
                        )}
                      </td>

                      {!isCustomerView && (
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                          {med.rackLocation}
                        </td>
                      )}

                      <td className="py-3.5 px-4 text-right">
                        {isCustomerView ? (
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              med.quantity > 0
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {med.quantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                          </span>
                        ) : (
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Bill cart */}
                            <button
                              onClick={() => onAddToBill(med)}
                              disabled={med.quantity === 0}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                med.quantity === 0
                                  ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400'
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              }`}
                              title={med.quantity === 0 ? 'Out of stock' : 'Add to POS Billing Cart'}
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </button>

                            {/* Full Edit Medicine */}
                            {onEditMedicine && (
                              <button
                                onClick={() => openFullEditModal(med)}
                                className="p-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 transition-colors cursor-pointer"
                                title="Edit Full Medicine Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Quick Adjust Stock */}
                            <button
                              onClick={() => openStockModal(med)}
                              className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                              title="Adjust Stock Units Count"
                            >
                              <Package className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Medicine */}
                            <button
                              onClick={() => onDeleteMedicine(med.id)}
                              className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Delete Medicine Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200 text-slate-600 font-semibold text-xs">
                <td colSpan={5} className="py-3 px-4">
                  Showing {filteredMedicines.length} of {medicines.length} total medicine records
                </td>
                <td className="py-3 px-4 font-mono">Total Value:</td>
                <td colSpan={3} className="py-3 px-4 font-mono font-bold text-slate-900">
                  ₹{filteredMedicines.reduce((acc, m) => acc + m.quantity * m.unitPrice, 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 1. Quick Adjust Stock Modal */}
      {stockModalMed && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 font-heading">
                Adjust Stock Quantity
              </h3>
              <button onClick={() => setStockModalMed(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockSave} className="mt-4 space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-600 block">Medicine Name:</span>
                <div className="text-sm font-bold text-slate-900 font-heading">
                  {stockModalMed.name} ({stockModalMed.strength})
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Batch: {stockModalMed.batchNo} • Current: {stockModalMed.quantity} units
                </div>
              </div>

              <div>
                <label htmlFor="new-qty-input" className="block text-xs font-bold text-slate-700 mb-1">
                  New Units Count in Stock
                </label>
                <input
                  id="new-qty-input"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={editQtyValue}
                  onChange={(e) => setEditQtyValue(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quick Restock Increment Buttons */}
              <div className="flex items-center gap-1.5">
                {[10, 25, 50, 100].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setEditQtyValue((prev) => prev + inc)}
                    className="flex-1 py-1 text-xs font-mono font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 cursor-pointer"
                  >
                    +{inc}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStockModalMed(null)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Admin Full Edit Medicine Modal */}
      {editingMedicine && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base font-heading flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                Edit Medicine Details ({editingMedicine.id})
              </h3>
              <button onClick={() => setEditingMedicine(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFullEditSave} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Generic Salt Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editGeneric}
                    onChange={(e) => setEditGeneric(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Therapeutic Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dosage Form *
                  </label>
                  <select
                    value={editDosage}
                    onChange={(e) => setEditDosage(e.target.value as DosageFormType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Eye Drops'].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Strength
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="650mg, 500mg"
                    value={editStrength}
                    onChange={(e) => setEditStrength(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unit Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editBatch}
                    onChange={(e) => setEditBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editExpiry}
                    onChange={(e) => setEditExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rack Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editRack}
                    onChange={(e) => setEditRack(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    required
                    value={editManufacturer}
                    onChange={(e) => setEditManufacturer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reorder Alert Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editMinAlert}
                    onChange={(e) => setEditMinAlert(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="edit-rx-cb"
                  type="checkbox"
                  checked={editRequiresRx}
                  onChange={(e) => setEditRequiresRx(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="edit-rx-cb" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Requires Doctor Prescription (Schedule H / Rx Drug)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMedicine(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  Save Medicine Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
