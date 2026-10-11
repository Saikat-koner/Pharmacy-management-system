import React, { useState } from 'react';
import { Medicine, CategoryType, DosageFormType } from '../types/pharmacy';
import { 
  PlusCircle, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Thermometer,
  Palette,
  Clock,
  UploadCloud,
  Check
} from 'lucide-react';

interface MedicineFormViewProps {
  categories: string[];
  onAddMedicine: (newMed: Medicine) => void;
  onNavigateToInventory: () => void;
}

export const MedicineFormView: React.FC<MedicineFormViewProps> = ({
  categories,
  onAddMedicine,
  onNavigateToInventory,
}) => {
  // Unit II Standard Form Inputs
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [strength, setStrength] = useState('');
  const [category, setCategory] = useState<CategoryType>(categories[0] || 'Analgesics & Pain Relief');
  const [dosageForm, setDosageForm] = useState<DosageFormType>('Tablet');
  const [batchNo, setBatchNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantity, setQuantity] = useState<string>('50');
  const [unitPrice, setUnitPrice] = useState<string>('12.50');
  const [minAlertLevel, setMinAlertLevel] = useState<string>('15');
  const [rackLocation, setRackLocation] = useState('Rack A-01');
  const [manufacturer, setManufacturer] = useState('');
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  
  // Unit II Diverse Input Types: Range, Color, Time, Radio, File
  const [storageTemp, setStorageTemp] = useState<number>(20);
  const [labelColor, setLabelColor] = useState<string>('#059669');
  const [dispatchTime, setDispatchTime] = useState<string>('10:00');
  const [storageType, setStorageType] = useState<'ambient' | 'refrigerated' | 'controlled'>('ambient');
  const [certificateFileName, setCertificateFileName] = useState<string>('');
  const [storageNotes, setStorageNotes] = useState('');

  // Validation feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  // Form Validation (Unit II & III)
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Medicine brand name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Medicine name must be at least 2 characters.';
    }

    if (!genericName.trim()) {
      newErrors.genericName = 'Active generic formula/molecule is required.';
    }

    if (!batchNo.trim()) {
      newErrors.batchNo = 'Batch number is required.';
    } else if (!/^[A-Za-z0-9-]+$/.test(batchNo.trim())) {
      newErrors.batchNo = 'Pattern error: Must be alphanumeric (e.g. DL-8849).';
    }

    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required.';
    } else {
      const selected = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future.';
      }
    }

    const parsedPrice = parseFloat(unitPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      newErrors.unitPrice = 'Price must be a valid positive number > 0.';
    }

    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty < 0) {
      newErrors.quantity = 'Initial stock units must be >= 0.';
    }

    if (!manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer name is required.';
    }

    if (!rackLocation.trim()) {
      newErrors.rackLocation = 'Shelf/Rack location is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const newMedicine: Medicine = {
        id: `MED-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        genericName: genericName.trim(),
        strength: strength.trim() || 'Standard',
        category,
        dosageForm,
        batchNo: batchNo.trim().toUpperCase(),
        expiryDate,
        quantity: parseInt(quantity, 10),
        unitPrice: parseFloat(unitPrice),
        minAlertLevel: parseInt(minAlertLevel, 10) || 10,
        rackLocation: rackLocation.trim(),
        manufacturer: manufacturer.trim(),
        requiresPrescription,
      };

      onAddMedicine(newMedicine);
      setSubmittedSuccessfully(true);

      // Reset
      setName('');
      setGenericName('');
      setStrength('');
      setBatchNo('');
      setExpiryDate('');
      setManufacturer('');
      setCertificateFileName('');
      setStorageNotes('');
      setErrors({});
    }
  };

  const handleReset = () => {
    setName('');
    setGenericName('');
    setStrength('');
    setBatchNo('');
    setExpiryDate('');
    setQuantity('50');
    setUnitPrice('12.50');
    setMinAlertLevel('15');
    setRackLocation('Rack A-01');
    setManufacturer('');
    setRequiresPrescription(false);
    setStorageTemp(20);
    setLabelColor('#059669');
    setDispatchTime('10:00');
    setStorageType('ambient');
    setCertificateFileName('');
    setStorageNotes('');
    setErrors({});
    setSubmittedSuccessfully(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Form Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Register New Medicine to Inventory
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Record pharmaceutical formulation, batch specifications, cold-chain criteria, and dispensing compliance.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg font-mono shrink-0">
            Official Drug Registry
          </span>
        </div>
      </div>

      {submittedSuccessfully && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 font-heading">
                Medicine Registered Successfully!
              </h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                The pharmaceutical record passed all HTML5 constraint validations and has been saved to the client state.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setSubmittedSuccessfully(false)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 underline"
            >
              Add Another
            </button>
            <button
              onClick={onNavigateToInventory}
              className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
            >
              Go to Inventory
            </button>
          </div>
        </div>
      )}

      {/* Semantic HTML5 Form (Unit II) */}
      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        noValidate={false}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6"
      >
        {/* Section 1: Medicine Identification & Classification */}
        <fieldset className="border border-slate-200 rounded-xl p-5 bg-slate-50/40 space-y-4">
          <legend className="px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 rounded-md border border-emerald-200 font-heading">
            1. Medicine Identity &amp; Classification
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand Name */}
            <div>
              <label htmlFor="med-name" className="block text-xs font-bold text-slate-700 mb-1">
                Medicine Brand Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="med-name"
                name="medicineName"
                type="text"
                required
                maxLength={60}
                placeholder="e.g. Dolo 650, Augmentin 625 Duo"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                aria-required="true"
                aria-describedby="med-name-help"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl"
              />
              <span id="med-name-help" className="text-[10px] text-slate-400">
                Minimum 2 characters. Required.
              </span>
              {errors.name && (
                <p className="text-[11px] text-rose-600 mt-0.5 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Generic Formula */}
            <div>
              <label htmlFor="generic-name" className="block text-xs font-bold text-slate-700 mb-1">
                Active Generic Molecule / Formula <span className="text-rose-500">*</span>
              </label>
              <input
                id="generic-name"
                name="genericName"
                type="text"
                required
                placeholder="e.g. Paracetamol, Amoxicillin + Clavulanic Acid"
                value={genericName}
                onChange={(e) => {
                  setGenericName(e.target.value);
                  if (errors.genericName) setErrors({ ...errors, genericName: '' });
                }}
                aria-required="true"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl"
              />
              {errors.genericName && (
                <p className="text-[11px] text-rose-600 mt-0.5 font-medium">{errors.genericName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category-select" className="block text-xs font-bold text-slate-700 mb-1">
                Therapeutic Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category-select"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Dosage Form */}
            <div>
              <label htmlFor="dosage-select" className="block text-xs font-bold text-slate-700 mb-1">
                Dosage Form <span className="text-rose-500">*</span>
              </label>
              <select
                id="dosage-select"
                name="dosageForm"
                value={dosageForm}
                onChange={(e) => setDosageForm(e.target.value as DosageFormType)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl"
              >
                <option value="Tablet">Tablet (Solid)</option>
                <option value="Capsule">Capsule (Gelatin)</option>
                <option value="Syrup">Syrup (Liquid)</option>
                <option value="Injection">Injection (Vial)</option>
                <option value="Ointment">Ointment (Cream)</option>
                <option value="Eye Drops">Eye Drops (Sterile)</option>
              </select>
            </div>

            {/* Strength */}
            <div>
              <label htmlFor="med-strength" className="block text-xs font-bold text-slate-700 mb-1">
                Strength / Volume Specification
              </label>
              <input
                id="med-strength"
                name="strength"
                type="text"
                placeholder="e.g. 650mg, 100ml, 5% w/w"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </fieldset>

        {/* Section 2: Batch, Date, Pricing, Numbers */}
        <fieldset className="border border-slate-200 rounded-xl p-5 bg-slate-50/40 space-y-4">
          <legend className="px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 rounded-md border border-teal-200 font-heading">
            2. Batch Numbers, Expiry &amp; Pricing
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Batch Number */}
            <div>
              <label htmlFor="batch-no" className="block text-xs font-bold text-slate-700 mb-1">
                Batch Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="batch-no"
                name="batchNumber"
                type="text"
                required
                pattern="^[A-Za-z0-9-]+$"
                placeholder="e.g. DL-8849"
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl uppercase font-mono"
              />
              {errors.batchNo && (
                <p className="text-[11px] text-rose-600 mt-0.5 font-medium">{errors.batchNo}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label htmlFor="expiry-date" className="block text-xs font-bold text-slate-700 mb-1">
                Expiry Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="expiry-date"
                name="expiryDate"
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl font-mono"
              />
              {errors.expiryDate && (
                <p className="text-[11px] text-rose-600 mt-0.5 font-medium">{errors.expiryDate}</p>
              )}
            </div>

            {/* Unit Price */}
            <div>
              <label htmlFor="unit-price" className="block text-xs font-bold text-slate-700 mb-1">
                Unit Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                id="unit-price"
                name="unitPrice"
                type="number"
                step="0.01"
                min="0.01"
                max="50000"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-xs font-bold text-slate-700 mb-1">
                Stock Quantity Units <span className="text-rose-500">*</span>
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl font-mono"
              />
            </div>

            {/* Min Alert Level */}
            <div>
              <label htmlFor="min-alert" className="block text-xs font-bold text-slate-700 mb-1">
                Reorder Threshold Level
              </label>
              <input
                id="min-alert"
                name="minAlertLevel"
                type="number"
                min="1"
                value={minAlertLevel}
                onChange={(e) => setMinAlertLevel(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl font-mono"
              />
            </div>

            {/* Rack Location */}
            <div>
              <label htmlFor="rack-location" className="block text-xs font-bold text-slate-700 mb-1">
                Rack / Shelf Location <span className="text-rose-500">*</span>
              </label>
              <input
                id="rack-location"
                name="rackLocation"
                type="text"
                required
                placeholder="e.g. Rack B-04"
                value={rackLocation}
                onChange={(e) => setRackLocation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </fieldset>

        {/* Section 3: Storage Conditions & Quality Verification */}
        <fieldset className="border border-slate-200 rounded-xl p-5 bg-slate-50/40 space-y-4">
          <legend className="px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100/70 rounded-md border border-blue-200 font-heading">
            3. Storage Conditions &amp; Quality Verification
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Storage Temperature */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <label htmlFor="storage-temp" className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                  Storage Temperature
                </span>
                <span className="font-mono text-emerald-700 font-bold">{storageTemp}°C</span>
              </label>
              <input
                id="storage-temp"
                name="storageTemperature"
                type="range"
                min="2"
                max="35"
                step="1"
                value={storageTemp}
                onChange={(e) => setStorageTemp(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>2°C (Cold Chain)</span>
                <span>20°C (Room)</span>
                <span>35°C (Max)</span>
              </div>
            </div>

            {/* Packaging Color Code */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <label htmlFor="label-color" className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-purple-600" />
                  Packaging Tag Color
                </span>
                <span className="font-mono text-xs" style={{ color: labelColor }}>{labelColor}</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="label-color"
                  name="labelColor"
                  type="color"
                  value={labelColor}
                  onChange={(e) => setLabelColor(e.target.value)}
                  className="w-10 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                />
                <span className="text-xs text-slate-500">Visual shelf category tag</span>
              </div>
            </div>

            {/* Dispatch Cutoff Time */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <label htmlFor="dispatch-time" className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Daily Dispatch Cutoff
              </label>
              <input
                id="dispatch-time"
                name="dispatchTime"
                type="time"
                value={dispatchTime}
                onChange={(e) => setDispatchTime(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          {/* Storage Type Radio */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
            <span className="block text-xs font-bold text-slate-700">
              Preservation Storage Type <span className="text-rose-500">*</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'ambient', label: 'Ambient Shelf (15°C - 25°C)' },
                { id: 'refrigerated', label: 'Refrigerated Cold Chain (2°C - 8°C)' },
                { id: 'controlled', label: 'Schedule Controlled Drug Vault' },
              ].map((radio) => (
                <label key={radio.id} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="storageTypeRadio"
                    value={radio.id}
                    checked={storageType === radio.id}
                    onChange={() => setStorageType(radio.id as any)}
                    className="accent-emerald-600 w-4 h-4"
                  />
                  <span>{radio.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CoA Upload */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <label htmlFor="file-upload" className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                Certificate of Analysis (CoA)
              </label>
              <input
                id="file-upload"
                name="drugCertificate"
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => setCertificateFileName(e.target.files?.[0]?.name || '')}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
              {certificateFileName && (
                <span className="text-[11px] text-emerald-700 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" /> Attached: {certificateFileName}
                </span>
              )}
            </div>

            {/* Schedule H Rx Flag */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="requiresPrescriptionCheckbox"
                  checked={requiresPrescription}
                  onChange={(e) => setRequiresPrescription(e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-600"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    Schedule H / Prescription Required (Rx)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Mandates registered physician prescription prior to dispensing
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Manufacturer & Storage Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="manufacturer" className="block text-xs font-bold text-slate-700 mb-1">
                Pharma Manufacturer Company <span className="text-rose-500">*</span>
              </label>
              <input
                id="manufacturer"
                name="manufacturer"
                type="text"
                required
                placeholder="e.g. Cipla, Sun Pharma, Micro Labs"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label htmlFor="storage-notes" className="block text-xs font-bold text-slate-700 mb-1">
                Storage Instructions &amp; Warnings
              </label>
              <textarea
                id="storage-notes"
                name="storageNotes"
                rows={2}
                placeholder="e.g. Protect from direct sunlight and moisture. Shake well before use."
                value={storageNotes}
                onChange={(e) => setStorageNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </fieldset>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <button
            type="reset"
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Register Medicine</span>
          </button>
        </div>
      </form>
    </div>
  );
};
