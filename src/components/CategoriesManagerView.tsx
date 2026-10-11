import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Check, X, AlertCircle, Pill, ArrowRight } from 'lucide-react';
import { Medicine } from '../types/pharmacy';

interface CategoriesManagerViewProps {
  categories: string[];
  medicines: Medicine[];
  onAddCategory: (category: string) => void;
  onEditCategory: (oldCat: string, newCat: string) => void;
  onDeleteCategory: (category: string) => void;
  onSelectCategoryFilter: (category: string) => void;
}

export const CategoriesManagerView: React.FC<CategoriesManagerViewProps> = ({
  categories,
  medicines,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onSelectCategoryFilter,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = newCatName.trim();
    if (!trimmed) return;

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('This therapeutic category already exists.');
      return;
    }

    onAddCategory(trimmed);
    setNewCatName('');
  };

  const startEdit = (cat: string) => {
    setEditingCat(cat);
    setEditValue(cat);
    setErrorMsg('');
  };

  const handleSaveEdit = (oldCat: string) => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === oldCat) {
      setEditingCat(null);
      return;
    }

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase() && c !== oldCat)) {
      setErrorMsg('Another category already has this name.');
      return;
    }

    onEditCategory(oldCat, trimmed);
    setEditingCat(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Therapeutic Categories &amp; Pharmacology Classification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin tool to manage therapeutic categories, drug classes, and associate inventory items.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-mono font-bold self-start sm:self-center">
          {categories.length} Categories Defined
        </span>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Add New Category Form */}
      <form onSubmit={handleCreate} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <label htmlFor="new-cat-input" className="block text-xs font-bold text-slate-700 mb-1">
            Create New Therapeutic Category
          </label>
          <input
            id="new-cat-input"
            type="text"
            required
            placeholder="e.g. Dermatological Care, Oncology Support, Herbal Remedies"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 mt-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </form>

      {/* Categories Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <caption className="sr-only">Registered Therapeutic Categories List</caption>
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Therapeutic Category</th>
              <th className="py-3 px-4 text-center">Stocked Medicines</th>
              <th className="py-3 px-4 text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat, idx) => {
              const count = medicines.filter((m) => m.category === cat).length;
              const isEditing = editingCat === cat;

              return (
                <tr key={cat} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                    {idx + 1}
                  </td>

                  <td className="py-3.5 px-4">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="px-2.5 py-1 text-xs border border-emerald-400 rounded-lg bg-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(cat)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCat(null)}
                          className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="font-bold text-slate-900 font-heading text-sm">
                        {cat}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 font-mono">
                      {count} medicines
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onSelectCategoryFilter(cat)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                        title="View medicines in catalog"
                      >
                        <Pill className="w-3.5 h-3.5" />
                        <span>View Items</span>
                      </button>

                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Category Name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (count > 0) {
                            alert(`Cannot delete category "${cat}" because ${count} medicines are assigned to it. Reassign medicines first.`);
                            return;
                          }
                          if (confirm(`Delete therapeutic category "${cat}"?`)) {
                            onDeleteCategory(cat);
                          }
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          count > 0
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-rose-500 hover:bg-rose-50'
                        }`}
                        title={count > 0 ? 'Has assigned medicines' : 'Delete category'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
