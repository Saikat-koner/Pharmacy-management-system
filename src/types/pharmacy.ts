export type CategoryType = string;

export type DosageFormType = 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Eye Drops';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: CategoryType;
  dosageForm: DosageFormType;
  strength: string; // e.g. "650mg", "500mg", "100ml"
  batchNo: string;
  expiryDate: string; // YYYY-MM-DD
  quantity: number;
  unitPrice: number; // in currency units
  minAlertLevel: number;
  rackLocation: string; // e.g. "Rack A-2", "Shelf B-4"
  manufacturer: string;
  requiresPrescription: boolean;
}

export interface BillItem {
  medicineId: string;
  medicineName: string;
  batchNo: string;
  dosageForm: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface BillReceipt {
  billId: string;
  customerName: string;
  customerPhone: string;
  doctorName?: string;
  date: string;
  time: string;
  items: BillItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;
  paymentMode: 'Cash' | 'Card' | 'UPI' | 'Net Banking';
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  suppliedCategories: string[];
  leadTimeDays: number;
}

export interface PrescriptionOrder {
  id: string;
  patientName: string;
  age: number;
  doctorName: string;
  doctorRegNo: string;
  prescriptionDate: string;
  medicines: { medicineName: string; dosage: string; days: number; qty: number }[];
  status: 'Pending' | 'Dispensed' | 'Verified';
  notes: string;
}

export interface PharmacyShop {
  id: string;
  name: string;
  branchCode: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  timings: string;
  lat: number;
  lng: number;
  pharmacistInCharge: string;
  is24x7: boolean;
  services: string[];
}

export interface CustomerEnquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
  date: string;
  time: string;
  status: 'New' | 'Replied' | 'Resolved';
  urgency?: 'Normal' | 'Urgent' | 'Emergency';
  adminReply?: string;
  repliedDate?: string;
}

export type PortalMode = 'user' | 'admin';
