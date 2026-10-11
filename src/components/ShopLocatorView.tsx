import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  Check, 
  Building2,
  Navigation as NavigationIcon,
  Search,
  Sparkles,
  Layers,
  Info,
  CheckCircle2
} from 'lucide-react';
import { PharmacyShop } from '../types/pharmacy';

interface ShopLocatorViewProps {
  shops: PharmacyShop[];
  isAdmin: boolean;
  onAddShop: (shop: PharmacyShop) => void;
  onUpdateShop: (shop: PharmacyShop) => void;
  onDeleteShop: (id: string) => void;
}

// Coordinate projection helper for Bangalore city bounding box
const CITY_BOUNDS = {
  minLat: 12.900,
  maxLat: 13.020,
  minLng: 77.540,
  maxLng: 77.760,
};

const projectToPercent = (lat: number, lng: number) => {
  const x = ((lng - CITY_BOUNDS.minLng) / (CITY_BOUNDS.maxLng - CITY_BOUNDS.minLng)) * 100;
  const y = (1 - (lat - CITY_BOUNDS.minLat) / (CITY_BOUNDS.maxLat - CITY_BOUNDS.minLat)) * 100;
  return {
    x: Math.max(8, Math.min(92, x)),
    y: Math.max(8, Math.min(92, y)),
  };
};

export const ShopLocatorView: React.FC<ShopLocatorViewProps> = ({
  shops,
  isAdmin,
  onAddShop,
  onUpdateShop,
  onDeleteShop,
}) => {
  const [selectedShopId, setSelectedShopId] = useState<string>(shops[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter24x7Only, setFilter24x7Only] = useState(false);
  const [mapMode, setMapMode] = useState<'interactive' | 'osm'>('interactive');
  
  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingShop, setEditingShop] = useState<PharmacyShop | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formBranchCode, setFormBranchCode] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTimings, setFormTimings] = useState('');
  const [formLat, setFormLat] = useState<number>(12.9716);
  const [formLng, setFormLng] = useState<number>(77.5946);
  const [formPharmacist, setFormPharmacist] = useState('');
  const [formIs24x7, setFormIs24x7] = useState(false);
  const [formServices, setFormServices] = useState<string[]>([
    'Prescription Dispensing',
    'Over-The-Counter Medicines'
  ]);

  const selectedShop = shops.find((s) => s.id === selectedShopId) || shops[0];

  const filteredShops = useMemo(() => {
    return shops.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.branchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city.toLowerCase().includes(searchTerm.toLowerCase());
      const match24x7 = !filter24x7Only || s.is24x7;
      return matchSearch && match24x7;
    });
  }, [shops, searchTerm, filter24x7Only]);

  const openAddModal = () => {
    setEditingShop(null);
    setFormName('');
    setFormBranchCode(`PC-BRANCH-0${shops.length + 1}`);
    setFormAddress('');
    setFormCity('Bangalore, Karnataka - 560001');
    setFormPhone('+91 98450 9988' + (shops.length + 1));
    setFormEmail('branch' + (shops.length + 1) + '@pharmacare.org');
    setFormTimings('8:00 AM - 10:30 PM');
    setFormLat(12.9716);
    setFormLng(77.5946);
    setFormPharmacist('Dr. Registered Pharmacist, B.Pharm');
    setFormIs24x7(false);
    setFormServices(['Prescription Dispensing', 'Home Delivery within 5km']);
    setShowModal(true);
  };

  const openEditModal = (shop: PharmacyShop) => {
    setEditingShop(shop);
    setFormName(shop.name);
    setFormBranchCode(shop.branchCode);
    setFormAddress(shop.address);
    setFormCity(shop.city);
    setFormPhone(shop.phone);
    setFormEmail(shop.email);
    setFormTimings(shop.timings);
    setFormLat(shop.lat);
    setFormLng(shop.lng);
    setFormPharmacist(shop.pharmacistInCharge);
    setFormIs24x7(shop.is24x7);
    setFormServices(shop.services && shop.services.length > 0 ? shop.services : ['Prescription Dispensing']);
    setShowModal(true);
  };

  const handleToggleService = (serviceName: string) => {
    if (formServices.includes(serviceName)) {
      setFormServices(formServices.filter((s) => s !== serviceName));
    } else {
      setFormServices([...formServices, serviceName]);
    }
  };

  const setCoordinatePreset = (name: string, lat: number, lng: number) => {
    setFormLat(lat);
    setFormLng(lng);
  };

  const handleSaveShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingShop) {
      const updated: PharmacyShop = {
        ...editingShop,
        name: formName.trim(),
        branchCode: formBranchCode.trim(),
        address: formAddress.trim(),
        city: formCity.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        timings: formTimings.trim(),
        lat: Number(formLat),
        lng: Number(formLng),
        pharmacistInCharge: formPharmacist.trim(),
        is24x7: formIs24x7,
        services: formServices,
      };
      onUpdateShop(updated);
      setSelectedShopId(updated.id);
      setSuccessToast(`Branch "${updated.name}" updated successfully.`);
    } else {
      const newShop: PharmacyShop = {
        id: `SHOP-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        branchCode: formBranchCode.trim() || `PC-BRANCH-0${shops.length + 1}`,
        address: formAddress.trim(),
        city: formCity.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        timings: formTimings.trim(),
        lat: Number(formLat),
        lng: Number(formLng),
        pharmacistInCharge: formPharmacist.trim(),
        is24x7: formIs24x7,
        services: formServices,
      };
      onAddShop(newShop);
      setSelectedShopId(newShop.id);
      setSuccessToast(`New branch "${newShop.name}" added to map.`);
    }

    setShowModal(false);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // OpenStreetMap embed URL
  const delta = 0.012;
  const osmEmbedUrl = selectedShop
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${selectedShop.lng - delta}%2C${selectedShop.lat - delta}%2C${selectedShop.lng + delta}%2C${selectedShop.lat + delta}&layer=mapnik&marker=${selectedShop.lat}%2C${selectedShop.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=77.580%2C12.960%2C77.620%2C12.990&layer=mapnik&marker=12.975%2C77.600`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            Pharmacy Store Locations &amp; Branch Map
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Locate physical PharmaCare branches across the city, view live chemist operating hours, pharmacist in-charge, and get direct directions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {isAdmin ? (
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Store (Admin)</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {shops.length} Verified Stores
            </span>
          )}
        </div>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900 p-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Branch List (Left) & Map View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Branches List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search Box & Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search branches by area, street, branch code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
              />
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={filter24x7Only}
                  onChange={(e) => setFilter24x7Only(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Show 24x7 Emergency only</span>
              </label>

              <span className="text-slate-400 font-mono text-[11px]">
                Showing {filteredShops.length} of {shops.length}
              </span>
            </div>
          </div>

          {/* Branch Cards Scrollable List */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredShops.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                No pharmacy branches matched your search.
              </div>
            ) : (
              filteredShops.map((shop) => {
                const isSelected = selectedShop?.id === shop.id;

                return (
                  <div
                    key={shop.id}
                    onClick={() => setSelectedShopId(shop.id)}
                    className={`p-4.5 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 shadow-sm ring-1 ring-emerald-400/50'
                        : 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 font-heading">
                          {shop.name}
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded mt-1 inline-block">
                          {shop.branchCode}
                        </span>
                      </div>

                      {shop.is24x7 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 shrink-0">
                          24x7 Open
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {shop.address}, {shop.city}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <a
                        href={`tel:${shop.phone.replace(/[^0-9+]/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{shop.phone}</span>
                      </a>

                      <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{shop.timings}</span>
                      </span>
                    </div>

                    {/* Admin Edit/Delete Controls */}
                    {isAdmin && (
                      <div className="mt-3 pt-2 border-t border-dashed border-slate-200 flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(shop);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-slate-500" />
                          <span>Edit Details</span>
                        </button>

                        {shops.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Remove branch "${shop.name}" from store locations?`)) {
                                onDeleteShop(shop.id);
                              }
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3 text-rose-500" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map & Selected Branch Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Selected Branch Overview Banner */}
          {selectedShop && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-heading">
                    {selectedShop.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                    <span>In-Charge: <strong>{selectedShop.pharmacistInCharge}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-emerald-700 font-semibold">{selectedShop.branchCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${selectedShop.phone.replace(/[^0-9+]/g, '')}`}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Store
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedShop.lat},${selectedShop.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <NavigationIcon className="w-3.5 h-3.5 text-emerald-700" /> Get Directions ↗
                  </a>
                </div>
              </div>

              {/* Services tags */}
              {selectedShop.services && selectedShop.services.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400">Available Services:</span>
                  {selectedShop.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Interactive Map Container */}
          <div className="bg-white rounded-3xl border border-slate-200 p-3 shadow-xs space-y-3">
            {/* Map Mode Switcher Header */}
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 font-heading">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>City Location Map ({shops.length} Pins Plotted)</span>
              </div>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setMapMode('interactive')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    mapMode === 'interactive'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Interactive Grid Map
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('osm')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    mapMode === 'osm'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Satellite / Street Map
                </button>
              </div>
            </div>

            {/* Map Canvas / Display */}
            {mapMode === 'interactive' ? (
              /* Custom Interactive SVG Schematic Map */
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner h-96 bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-50/20 relative select-none">
                {/* SVG City Roads & Zones Grid */}
                <svg className="w-full h-full absolute inset-0 pointer-events-none opacity-40">
                  <defs>
                    <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#city-grid)" />
                  {/* Diagonal arterial roads */}
                  <line x1="0" y1="40" x2="800" y2="350" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 3" />
                  <line x1="100" y1="0" x2="600" y2="400" stroke="#94a3b8" strokeWidth="2.5" />
                  <line x1="0" y1="200" x2="800" y2="180" stroke="#10b981" strokeWidth="2" strokeOpacity="0.5" />
                  {/* City Ring Road */}
                  <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>

                {/* City Landmarks Annotations */}
                <div className="absolute top-3 left-4 text-[10px] font-mono font-bold text-slate-400 bg-white/70 px-2 py-0.5 rounded shadow-2xs">
                  NORTH ZONE (Malleshwaram)
                </div>
                <div className="absolute top-3 right-4 text-[10px] font-mono font-bold text-slate-400 bg-white/70 px-2 py-0.5 rounded shadow-2xs">
                  EAST TECH CORRIDOR (Whitefield)
                </div>
                <div className="absolute bottom-3 left-4 text-[10px] font-mono font-bold text-slate-400 bg-white/70 px-2 py-0.5 rounded shadow-2xs">
                  SOUTH ZONE (Jayanagar)
                </div>
                <div className="absolute bottom-3 right-4 text-[10px] font-mono font-bold text-slate-400 bg-white/70 px-2 py-0.5 rounded shadow-2xs">
                  SOUTHEAST (Koramangala)
                </div>

                {/* Render pins for each shop */}
                {shops.map((shop) => {
                  const { x, y } = projectToPercent(shop.lat, shop.lng);
                  const isSelected = selectedShop?.id === shop.id;

                  return (
                    <div
                      key={shop.id}
                      onClick={() => setSelectedShopId(shop.id)}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-125 z-10"
                    >
                      {/* Pulse beacon for selected pin */}
                      {isSelected && (
                        <span className="absolute -inset-2.5 rounded-full bg-emerald-500/30 animate-ping"></span>
                      )}

                      <div
                        className={`p-2 rounded-full shadow-md flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 scale-110'
                            : shop.is24x7
                            ? 'bg-rose-600 text-white hover:bg-rose-700'
                            : 'bg-white text-emerald-800 border-2 border-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={`${shop.name} (${shop.branchCode})`}
                      >
                        <MapPin className="w-4 h-4 stroke-[2.2]" />
                      </div>

                      {/* Floating Label Badge */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs pointer-events-none transition-all ${
                          isSelected
                            ? 'top-8 bg-slate-900 text-white ring-1 ring-white/20 z-20'
                            : 'top-7 bg-white/95 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {shop.name.split(' ')[1] || shop.name}
                      </div>
                    </div>
                  );
                })}

                {/* Map Control overlay (Click to zoom/center) */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200 text-[11px] text-slate-600 shadow-2xs pointer-events-none">
                  💡 Click on any pin to view branch details &amp; directions
                </div>
              </div>
            ) : (
              /* Fallback OpenStreetMap Embed */
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner h-96 bg-slate-100 relative">
                <iframe
                  title="Pharmacy Store Branch Location Map"
                  src={osmEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>
              </div>
            )}

            {/* Map Footer Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 px-2 py-1 gap-2 font-mono border-t border-slate-100">
              <span>
                Selected: <strong>{selectedShop?.name}</strong> ({selectedShop?.lat.toFixed(4)}° N, {selectedShop?.lng.toFixed(4)}° E)
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedShop?.lat},${selectedShop?.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline flex items-center gap-1 font-sans font-semibold"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Add/Edit Branch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base font-heading flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                {editingShop ? 'Edit Pharmacy Branch Details' : 'Add New Pharmacy Branch Location'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShop} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PharmaCare Koramangala Health Clinic Store"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Branch Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PC-KORAM-03"
                    value={formBranchCode}
                    onChange={(e) => setFormBranchCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono uppercase focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98450 00000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 74, 5th Block, Near Jyoti Nivas College Road"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City &amp; Pincode
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bangalore, Karnataka - 560095"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Operating Timings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8:00 AM - 11:00 PM"
                    value={formTimings}
                    onChange={(e) => setFormTimings(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pharmacist In-Charge
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh Kulkarni, B.Pharm"
                  value={formPharmacist}
                  onChange={(e) => setFormPharmacist(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Map Coordinates & Quick City Presets */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Map Pin Coordinates</span>
                  <span className="text-[11px] text-slate-400 font-normal">Quick Bangalore Presets:</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pb-1">
                  <button
                    type="button"
                    onClick={() => setCoordinatePreset('Central', 12.9716, 77.5946)}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 hover:bg-emerald-50 cursor-pointer"
                  >
                    Central (12.97, 77.59)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoordinatePreset('Indiranagar', 12.9784, 77.6408)}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 hover:bg-emerald-50 cursor-pointer"
                  >
                    Indiranagar (12.97, 77.64)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoordinatePreset('Koramangala', 12.9352, 77.6245)}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 hover:bg-emerald-50 cursor-pointer"
                  >
                    Koramangala (12.93, 77.62)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoordinatePreset('Whitefield', 12.9863, 77.7337)}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 hover:bg-emerald-50 cursor-pointer"
                  >
                    Whitefield (12.98, 77.73)
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 mb-0.5">
                      Latitude (°N)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formLat}
                      onChange={(e) => setFormLat(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-500 mb-0.5">
                      Longitude (°E)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formLng}
                      onChange={(e) => setFormLng(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 24x7 Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="form-247-cb"
                  type="checkbox"
                  checked={formIs24x7}
                  onChange={(e) => setFormIs24x7(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="form-247-cb" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Mark as 24x7 Open Emergency Counter
                </label>
              </div>

              {/* Available Services Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Available Services at Branch:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Prescription Dispensing',
                    'Home Delivery within 5km',
                    'Cold Chain Vaccine Storage',
                    'Oxygen Cylinder Refill',
                    'Blood Sugar Check',
                    'Senior Citizen Discounts'
                  ].map((service) => (
                    <label key={service} className="flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formServices.includes(service)}
                        onChange={() => handleToggleService(service)}
                        className="rounded text-emerald-600"
                      />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                >
                  {editingShop ? 'Save Branch Changes' : 'Create & Plot on Map'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
