import React, { useState } from 'react';
import { Supplier } from '../types/pharmacy';
import { Truck, Phone, Mail, MapPin, Clock, Plus, Building2, CheckCircle2 } from 'lucide-react';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onAddSupplier,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [leadTime, setLeadTime] = useState<number>(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSupplier: Supplier = {
      id: `SUP-${Math.floor(10 + Math.random() * 90)}`,
      name: name.trim(),
      contactPerson: contactPerson.trim() || 'Distribution Rep',
      phone: phone.trim() || '+91 90000 00000',
      email: email.trim() || 'contact@supplier.com',
      city: city.trim() || 'Central City',
      suppliedCategories: ['Antibiotics', 'General Pharma'],
      leadTimeDays: leadTime,
    };

    onAddSupplier(newSupplier);
    setShowModal(false);
    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setCity('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            Pharmaceutical Suppliers & Distributors
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified medicine procurement partners, dispatch turnaround times, and therapeutic supply contracts.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Distributor</span>
        </button>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {suppliers.map((sup) => (
          <div
            key={sup.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-mono text-xs text-slate-400 font-bold">
                  {sup.id}
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {sup.leadTimeDays} days delivery
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-base text-slate-900 font-heading">
                  {sup.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Contact: {sup.contactPerson}
                </p>
              </div>

              {/* Contact meta */}
              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{sup.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{sup.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sup.city}</span>
                </div>
              </div>

              {/* Supplied categories */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">
                  Authorized Categories:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sup.suppliedCategories.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Supplier
              </span>
              <a
                href={`tel:${sup.phone.replace(/[^0-9+]/g, '')}`}
                className="text-slate-700 hover:text-emerald-700 font-bold"
              >
                Call Supplier
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base font-heading pb-3 border-b border-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Add Pharmaceutical Supplier
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Distributor Agency Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medex Pharma Supplies"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Seth"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    City Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Delivery Lead Time (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={leadTime}
                    onChange={(e) => setLeadTime(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="contact@distributor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  Save Distributor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
