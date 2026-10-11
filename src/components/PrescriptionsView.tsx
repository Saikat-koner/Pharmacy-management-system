import React, { useState } from 'react';
import { PrescriptionOrder } from '../types/pharmacy';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Plus, 
  User, 
  Stethoscope, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

interface PrescriptionsViewProps {
  prescriptions: PrescriptionOrder[];
  onUpdateStatus: (id: string, status: 'Pending' | 'Verified' | 'Dispensed') => void;
  onAddPrescription: (order: PrescriptionOrder) => void;
  onDispenseToBill: (order: PrescriptionOrder) => void;
}

export const PrescriptionsView: React.FC<PrescriptionsViewProps> = ({
  prescriptions,
  onUpdateStatus,
  onAddPrescription,
  onDispenseToBill,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number>(30);
  const [doctorName, setDoctorName] = useState('');
  const [doctorRegNo, setDoctorRegNo] = useState('');
  const [medicineStr, setMedicineStr] = useState('Paracetamol 650mg (1 tablet thrice daily for 3 days)');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!patientName.trim()) {
      setFormError('Patient name is required.');
      return;
    }

    if (!doctorName.trim()) {
      setFormError('Doctor name is required.');
      return;
    }

    const newRx: PrescriptionOrder = {
      id: `RX-${Math.floor(100 + Math.random() * 900)}`,
      patientName: patientName.trim(),
      age: patientAge,
      doctorName: doctorName.trim(),
      doctorRegNo: doctorRegNo.trim() || 'MCI-REG-PENDING',
      prescriptionDate: new Date().toISOString().slice(0, 10),
      medicines: [
        {
          medicineName: medicineStr.trim(),
          dosage: 'As prescribed by physician',
          days: 5,
          qty: 10,
        },
      ],
      status: 'Pending',
      notes: notes.trim() || 'Regular consultation prescription.',
    };

    onAddPrescription(newRx);
    setShowAddModal(false);
    setPatientName('');
    setDoctorName('');
    setDoctorRegNo('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Prescription Verification & Dispensing Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compliance safety workflow for Schedule H drugs with doctor credentials verification and direct POS handoff.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Prescription Entry</span>
        </button>
      </div>

      {/* Prescription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {prescriptions.map((rx) => {
          const isPending = rx.status === 'Pending';
          const isVerified = rx.status === 'Verified';
          const isDispensed = rx.status === 'Dispensed';

          return (
            <div
              key={rx.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-mono font-bold text-xs text-slate-500">
                    {rx.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isPending
                        ? 'bg-amber-100 text-amber-800'
                        : isVerified
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {rx.status}
                  </span>
                </div>

                {/* Patient & Doctor details */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-sm text-slate-900 font-heading">
                        {rx.patientName}
                      </div>
                      <div className="text-xs text-slate-500">
                        Age: {rx.age} yrs • Date: {rx.prescriptionDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <Stethoscope className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-800">
                        {rx.doctorName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {rx.doctorRegNo}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prescribed Items */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Prescribed Medicines:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {rx.medicines.map((m, idx) => (
                      <li key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                        <div className="font-bold text-emerald-900">{m.medicineName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{m.dosage}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Notes */}
                {rx.notes && (
                  <div className="mt-3 text-[11px] text-slate-500 bg-amber-50/60 border border-amber-200/50 p-2 rounded-lg">
                    <strong className="text-amber-900">Pharmacist Note:</strong> {rx.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <select
                  value={rx.status}
                  onChange={(e) => onUpdateStatus(rx.id, e.target.value as any)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Dispensed">Dispensed</option>
                </select>

                <button
                  onClick={() => onDispenseToBill(rx)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>To Billing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Prescription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base font-heading pb-3 border-b border-slate-100">
              New Doctor Prescription Entry
            </h3>

            {formError && (
              <div className="mt-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePrescription} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Sharma"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Patient Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Doctor MCI Reg No
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MCI-44210"
                    value={doctorRegNo}
                    onChange={(e) => setDoctorRegNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Doctor Name & Clinic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. R. Singhania, MD"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Prescribed Medicine & Dosage *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Augmentin 625 Duo (1 tablet twice daily)"
                  value={medicineStr}
                  onChange={(e) => setMedicineStr(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Clinical / Diagnosis Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Acute upper respiratory infection"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
