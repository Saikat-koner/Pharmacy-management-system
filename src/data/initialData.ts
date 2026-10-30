import { Medicine, Supplier, PrescriptionOrder, PharmacyShop, CustomerEnquiry, BillReceipt } from '../types/pharmacy';

export const INITIAL_CATEGORIES: string[] = [
  'Analgesics & Pain Relief',
  'Antibiotics',
  'Antihistamines & Allergy',
  'Gastrointestinal & Antacids',
  'Cardiovascular & Diabetes',
  'Vitamins & Supplements',
  'Topical & First Aid',
  'Respiratory & Cough',
  'Pediatric Care',
  'Orthopedic Supports',
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'MED-101',
    name: 'Dolo 650',
    genericName: 'Paracetamol',
    category: 'Analgesics & Pain Relief',
    dosageForm: 'Tablet',
    strength: '650mg',
    batchNo: 'DL-8849',
    expiryDate: '2027-08-31',
    quantity: 140,
    unitPrice: 2.15,
    minAlertLevel: 30,
    rackLocation: 'Rack A-01',
    manufacturer: 'Micro Labs Ltd',
    requiresPrescription: false
  },
  {
    id: 'MED-102',
    name: 'Augmentin 625 Duo',
    genericName: 'Amoxicillin + Clavulanic Acid',
    category: 'Antibiotics',
    dosageForm: 'Tablet',
    strength: '625mg',
    batchNo: 'AUG-4921',
    expiryDate: '2026-12-15',
    quantity: 38,
    unitPrice: 18.50,
    minAlertLevel: 25,
    rackLocation: 'Rack C-04',
    manufacturer: 'GlaxoSmithKline',
    requiresPrescription: true
  },
  {
    id: 'MED-103',
    name: 'Pan-D',
    genericName: 'Pantoprazole + Domperidone',
    category: 'Gastrointestinal & Antacids',
    dosageForm: 'Capsule',
    strength: '40mg + 30mg',
    batchNo: 'PND-9012',
    expiryDate: '2027-04-20',
    quantity: 85,
    unitPrice: 14.20,
    minAlertLevel: 20,
    rackLocation: 'Rack B-02',
    manufacturer: 'Alkem Laboratories',
    requiresPrescription: false
  },
  {
    id: 'MED-104',
    name: 'Allegra 120',
    genericName: 'Fexofenadine HCl',
    category: 'Antihistamines & Allergy',
    dosageForm: 'Tablet',
    strength: '120mg',
    batchNo: 'ALG-1102',
    expiryDate: '2027-11-10',
    quantity: 52,
    unitPrice: 16.80,
    minAlertLevel: 15,
    rackLocation: 'Rack A-05',
    manufacturer: 'Sanofi India',
    requiresPrescription: false
  },
  {
    id: 'MED-105',
    name: 'Glycomet-GP 1',
    genericName: 'Metformin + Glimepiride',
    category: 'Cardiovascular & Diabetes',
    dosageForm: 'Tablet',
    strength: '500mg + 1mg',
    batchNo: 'GLY-7734',
    expiryDate: '2026-10-30',
    quantity: 12,
    unitPrice: 9.40,
    minAlertLevel: 25,
    rackLocation: 'Rack D-01',
    manufacturer: 'USV Ltd',
    requiresPrescription: true
  },
  {
    id: 'MED-106',
    name: 'Ascoril LS Syrup',
    genericName: 'Levosalbutamol + Ambroxol + Guaifenesin',
    category: 'Respiratory & Cough',
    dosageForm: 'Syrup',
    strength: '100ml',
    batchNo: 'ASC-3310',
    expiryDate: '2027-03-15',
    quantity: 6,
    unitPrice: 112.00,
    minAlertLevel: 15,
    rackLocation: 'Rack E-02',
    manufacturer: 'Glenmark Pharmaceuticals',
    requiresPrescription: true
  },
  {
    id: 'MED-107',
    name: 'Becosules Z',
    genericName: 'B-Complex with Vitamin C & Zinc',
    category: 'Vitamins & Supplements',
    dosageForm: 'Capsule',
    strength: 'Multivitamin',
    batchNo: 'BCZ-9943',
    expiryDate: '2028-01-30',
    quantity: 160,
    unitPrice: 4.50,
    minAlertLevel: 40,
    rackLocation: 'Rack B-08',
    manufacturer: 'Pfizer Consumer Healthcare',
    requiresPrescription: false
  },
  {
    id: 'MED-108',
    name: 'Betadine 5% Antiseptic',
    genericName: 'Povidone-Iodine 5% w/w',
    category: 'Topical & First Aid',
    dosageForm: 'Ointment',
    strength: '20g tube',
    batchNo: 'BTD-6450',
    expiryDate: '2027-09-18',
    quantity: 45,
    unitPrice: 65.00,
    minAlertLevel: 10,
    rackLocation: 'Rack F-01',
    manufacturer: 'Win-Medicare',
    requiresPrescription: false
  },
  {
    id: 'MED-109',
    name: 'Azithral 500',
    genericName: 'Azithromycin',
    category: 'Antibiotics',
    dosageForm: 'Tablet',
    strength: '500mg',
    batchNo: 'AZT-2098',
    expiryDate: '2026-11-25',
    quantity: 0,
    unitPrice: 22.00,
    minAlertLevel: 20,
    rackLocation: 'Rack C-02',
    manufacturer: 'Alembic Pharma',
    requiresPrescription: true
  },
  {
    id: 'MED-110',
    name: 'Refresh Tears 0.5%',
    genericName: 'Carboxymethylcellulose Sodium',
    category: 'Topical & First Aid',
    dosageForm: 'Eye Drops',
    strength: '10ml bottle',
    batchNo: 'REF-7201',
    expiryDate: '2027-05-12',
    quantity: 24,
    unitPrice: 145.00,
    minAlertLevel: 10,
    rackLocation: 'Rack F-03',
    manufacturer: 'Allergan Healthcare',
    requiresPrescription: false
  }
];

export const INITIAL_SHOPS: PharmacyShop[] = [
  {
    id: 'SHOP-01',
    name: 'PharmaCare Central Hospital Branch',
    branchCode: 'PC-CENTRAL-01',
    address: '42 Health Avenue, Opposite Victoria Hospital, M.G. Road',
    city: 'Bangalore, Karnataka - 560001',
    phone: '+91 98450 99882',
    email: 'central@pharmacare.org',
    timings: '24 Hours Open (Day & Night)',
    lat: 12.9716,
    lng: 77.5946,
    pharmacistInCharge: 'Dr. Ramesh Kulkarni, B.Pharm',
    is24x7: true,
    services: ['24x7 Emergency Dispensing', 'Oxygen Cylinder Refill', 'Cold Chain Vaccine Storage', 'Blood Sugar Check']
  },
  {
    id: 'SHOP-02',
    name: 'PharmaCare Indiranagar Community Pharmacy',
    branchCode: 'PC-INDIRA-02',
    address: '108, 100 Feet Road, HAL 2nd Stage, Indiranagar',
    city: 'Bangalore, Karnataka - 560038',
    phone: '+91 98450 99883',
    email: 'indiranagar@pharmacare.org',
    timings: '8:00 AM - 11:00 PM',
    lat: 12.9784,
    lng: 77.6408,
    pharmacistInCharge: 'Smt. Priya Sundaram, M.Pharm',
    is24x7: false,
    services: ['Home Delivery within 5km', 'Surgical Belts & Support', 'Senior Citizen Discounts']
  },
  {
    id: 'SHOP-03',
    name: 'PharmaCare Koramangala Health Clinic Store',
    branchCode: 'PC-KORAM-03',
    address: '74, 5th Block, Near Jyoti Nivas College Road',
    city: 'Bangalore, Karnataka - 560095',
    phone: '+91 98450 99884',
    email: 'koramangala@pharmacare.org',
    timings: '7:30 AM - 11:30 PM',
    lat: 12.9352,
    lng: 77.6245,
    pharmacistInCharge: 'Shri Arun Kumar, D.Pharm',
    is24x7: false,
    services: ['Ayurvedic & Herbal Care', 'Pediatric Formulations', 'Prescription Verification']
  },
  {
    id: 'SHOP-04',
    name: 'PharmaCare Whitefield Tech-Park Outlet',
    branchCode: 'PC-WHITE-04',
    address: '22, ITPL Main Road, Prestige Shantiniketan Junction',
    city: 'Bangalore, Karnataka - 560066',
    phone: '+91 98450 99885',
    email: 'whitefield@pharmacare.org',
    timings: '24 Hours Open (Emergency Care)',
    lat: 12.9863,
    lng: 77.7337,
    pharmacistInCharge: 'Dr. Sneha George, Pharm.D',
    is24x7: true,
    services: ['24x7 Trauma First Aid', 'Corporate Express Counter', 'Digital Billing & Insurance']
  },
  {
    id: 'SHOP-05',
    name: 'PharmaCare Jayanagar South Wellness Store',
    branchCode: 'PC-JAYA-05',
    address: '382, 11th Main, 4th Block, Near Jayanagar Shopping Complex',
    city: 'Bangalore, Karnataka - 560011',
    phone: '+91 98450 99886',
    email: 'jayanagar@pharmacare.org',
    timings: '8:00 AM - 10:30 PM',
    lat: 12.9250,
    lng: 77.5838,
    pharmacistInCharge: 'Shri Venkatesh Murthy, B.Pharm',
    is24x7: false,
    services: ['Senior Citizen Assistance', 'Diabetic Health Monitoring', 'Free BP Checkup']
  },
  {
    id: 'SHOP-06',
    name: 'PharmaCare Malleshwaram Heritage Dispensary',
    branchCode: 'PC-MALL-06',
    address: '15, Margosa Road, Between 7th & 8th Cross, Malleshwaram',
    city: 'Bangalore, Karnataka - 560003',
    phone: '+91 98450 99887',
    email: 'malleshwaram@pharmacare.org',
    timings: '8:30 AM - 10:00 PM',
    lat: 12.9982,
    lng: 77.5714,
    pharmacistInCharge: 'Smt. Kavitha Rao, M.Pharm',
    is24x7: false,
    services: ['Herbal Remedies & Supplements', 'Baby Care Formulations', 'Prescription Delivery']
  }
];

export const INITIAL_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: 'ENQ-1001',
    customerName: 'Anand Mahindra',
    email: 'anand.m@gmail.com',
    phone: '9845012399',
    category: 'Medicine Availability',
    subject: 'Enquiry for Azithral 500mg availability',
    message: 'Hello, I need 3 strips of Azithral 500mg urgently. Could you let me know if it is available for home delivery at Indiranagar?',
    date: '2026-10-11',
    time: '10:30 AM',
    status: 'New',
    urgency: 'Urgent'
  },
  {
    id: 'ENQ-1002',
    customerName: 'Radha Krishnan',
    email: 'radha.k@outlook.com',
    phone: '9876543120',
    category: 'Prescription Refill',
    subject: 'Monthly Glycomet-GP 1 Refill Confirmation',
    message: 'Doctor renewed my prescription for Metformin and Glimepiride. Can you confirm if you have the USV Ltd batch?',
    date: '2026-10-10',
    time: '04:15 PM',
    status: 'Replied',
    urgency: 'Normal',
    adminReply: 'Yes Mrs. Krishnan, we have confirmed stock of genuine USV Ltd Glycomet-GP 1 (Batch: GLY-7734, Expiry: 10/2026). Your 60-day refill has been reserved at our Jayanagar branch.',
    repliedDate: '2026-10-10 at 05:20 PM'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-01',
    name: 'Apex Medicare Distributors',
    contactPerson: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'orders@apexmedicare.in',
    city: 'Mumbai',
    suppliedCategories: ['Antibiotics', 'Gastrointestinal & Antacids', 'Analgesics & Pain Relief'],
    leadTimeDays: 2
  },
  {
    id: 'SUP-02',
    name: 'Sun Pharma Logistics',
    contactPerson: 'Anita Rao',
    phone: '+91 91234 56789',
    email: 'supply@sunlogistics.com',
    city: 'Hyderabad',
    suppliedCategories: ['Cardiovascular & Diabetes', 'Vitamins & Supplements'],
    leadTimeDays: 3
  },
  {
    id: 'SUP-03',
    name: 'Reliable Surgicals & Remedies',
    contactPerson: 'Vikram Mehta',
    phone: '+91 94567 12340',
    email: 'contact@reliableremedies.org',
    city: 'Bengaluru',
    suppliedCategories: ['Topical & First Aid', 'Respiratory & Cough'],
    leadTimeDays: 1
  }
];

export const INITIAL_PRESCRIPTIONS: PrescriptionOrder[] = [
  {
    id: 'RX-901',
    patientName: 'Kavita Sundaram',
    age: 34,
    doctorName: 'Dr. S. Nair, MD',
    doctorRegNo: 'MCI-88421',
    prescriptionDate: '2026-10-10',
    medicines: [
      { medicineName: 'Augmentin 625 Duo', dosage: '1 tablet twice daily after meals', days: 5, qty: 10 },
      { medicineName: 'Pan-D', dosage: '1 capsule empty stomach morning', days: 5, qty: 5 }
    ],
    status: 'Pending',
    notes: 'Patient confirmed tolerance to Augmentin earlier.'
  },
  {
    id: 'RX-902',
    patientName: 'Arjun Verma',
    age: 58,
    doctorName: 'Dr. P. K. Banerjee, MBBS',
    doctorRegNo: 'MCI-42109',
    prescriptionDate: '2026-10-11',
    medicines: [
      { medicineName: 'Glycomet-GP 1', dosage: '1 tablet once daily before breakfast', days: 30, qty: 30 }
    ],
    status: 'Verified',
    notes: 'Regular monthly refill for Type 2 Diabetes management.'
  }
];

export const INITIAL_BILLS: BillReceipt[] = [
  {
    billId: 'INV-1001',
    customerName: 'Rohan Gupta',
    customerPhone: '+91 98450 12345',
    doctorName: 'Dr. S. Nair',
    date: '2026-10-11',
    time: '09:45 AM',
    items: [
      {
        medicineId: 'MED-101',
        medicineName: 'Dolo 650',
        batchNo: 'DL-8849',
        dosageForm: 'Tablet',
        unitPrice: 2.15,
        quantity: 10,
        total: 21.50
      },
      {
        medicineId: 'MED-103',
        medicineName: 'Pan-D',
        batchNo: 'PND-9012',
        dosageForm: 'Capsule',
        unitPrice: 14.20,
        quantity: 5,
        total: 71.00
      }
    ],
    subtotal: 92.50,
    discountPercent: 0,
    discountAmount: 0,
    taxPercent: 5,
    taxAmount: 4.63,
    grandTotal: 97.13,
    paymentMode: 'UPI'
  },
  {
    billId: 'INV-1002',
    customerName: 'Priya Nambiar',
    customerPhone: '+91 98765 41200',
    doctorName: 'Dr. P. K. Banerjee',
    date: '2026-10-11',
    time: '10:15 AM',
    items: [
      {
        medicineId: 'MED-102',
        medicineName: 'Augmentin 625 Duo',
        batchNo: 'AUG-4921',
        dosageForm: 'Tablet',
        unitPrice: 18.50,
        quantity: 10,
        total: 185.00
      }
    ],
    subtotal: 185.00,
    discountPercent: 0,
    discountAmount: 0,
    taxPercent: 5,
    taxAmount: 9.25,
    grandTotal: 194.25,
    paymentMode: 'Cash'
  }
];

export const SAMPLE_RECENT_BILLS = INITIAL_BILLS;

