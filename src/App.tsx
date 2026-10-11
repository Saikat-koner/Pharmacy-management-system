import React, { useState, useEffect } from 'react';
import { 
  Medicine, 
  PrescriptionOrder, 
  Supplier, 
  BillReceipt, 
  PharmacyShop, 
  CustomerEnquiry,
  PortalMode 
} from './types/pharmacy';
import { 
  INITIAL_MEDICINES, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_SUPPLIERS, 
  SAMPLE_RECENT_BILLS,
  INITIAL_SHOPS,
  INITIAL_CATEGORIES,
  INITIAL_ENQUIRIES
} from './data/initialData';
import { Header } from './components/Header';
import { Navigation, AppTabType } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { MedicineFormView } from './components/MedicineFormView';
import { BillingView } from './components/BillingView';
import { PrescriptionsView } from './components/PrescriptionsView';
import { SuppliersView } from './components/SuppliersView';
import { ShopLocatorView } from './components/ShopLocatorView';
import { CustomerEnquiryView } from './components/CustomerEnquiryView';
import { CategoriesManagerView } from './components/CategoriesManagerView';
import { AdminEnquiriesView } from './components/AdminEnquiriesView';
import { StoreInfoView } from './components/StoreInfoView';
import { InvoiceReceiptModal } from './components/InvoiceReceiptModal';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  PORTAL_MODE: 'pharmacare_portal_mode',
  MEDICINES: 'pharmacare_medicines_db',
  CATEGORIES: 'pharmacare_categories_db',
  SHOPS: 'pharmacare_shops_db',
  ENQUIRIES: 'pharmacare_enquiries_db',
  PRESCRIPTIONS: 'pharmacare_prescriptions_db',
  SUPPLIERS: 'pharmacare_suppliers_db',
  BILLS: 'pharmacare_bills_db',
};

export default function App() {
  const [portalMode, setPortalMode] = useState<PortalMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PORTAL_MODE);
      if (saved === 'admin' || saved === 'user') return saved;
    } catch (e) {
      console.error(e);
    }
    return 'user'; // Default landing experience for visitors
  });

  const [activeTab, setActiveTab] = useState<AppTabType>(() => {
    return portalMode === 'user' ? 'home' : 'dashboard';
  });

  const [selectedReceipt, setSelectedReceipt] = useState<BillReceipt | null>(null);
  const [categoryFilterForInventory, setCategoryFilterForInventory] = useState<string>('');

  // 1. Categories
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CATEGORIES;
  });

  // 2. Pharmacy Shops
  const [shops, setShops] = useState<PharmacyShop[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHOPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SHOPS;
  });

  // 3. Customer Enquiries
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ENQUIRIES;
  });

  // 4. Medicines
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDICINES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MEDICINES;
  });

  // 5. Prescriptions
  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRESCRIPTIONS;
  });

  // 6. Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SUPPLIERS;
  });

  // 7. Recent Bills
  const [recentBills, setRecentBills] = useState<BillReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BILLS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_RECENT_BILLS.map((b) => ({
      billId: b.billId,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      date: b.date,
      time: b.time,
      items: [
        {
          medicineId: 'MED-101',
          medicineName: 'Dolo 650 (650mg)',
          batchNo: 'DL-8849',
          dosageForm: 'Tablet',
          unitPrice: 2.15,
          quantity: 20,
          total: 43.0,
        },
      ],
      subtotal: b.grandTotal,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 5,
      taxAmount: 0,
      grandTotal: b.grandTotal,
      paymentMode: b.paymentMode,
    }));
  });

  // Pending prescription prefill for POS billing
  const [pendingRxPrefill, setPendingRxPrefill] = useState<{
    patientName: string;
    doctorName: string;
    items: { medicineName: string; qty: number }[];
  } | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PORTAL_MODE, portalMode);
  }, [portalMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(recentBills));
  }, [recentBills]);

  // Handle Mode Switch
  const handleTogglePortalMode = (mode: PortalMode) => {
    setPortalMode(mode);
    if (mode === 'user') {
      setActiveTab('home');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Category Handlers
  const handleAddCategory = (newCat: string) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleEditCategory = (oldCat: string, newCat: string) => {
    setCategories((prev) => prev.map((c) => (c === oldCat ? newCat : c)));
    // Also update all medicines with that category
    setMedicines((prev) =>
      prev.map((m) => (m.category === oldCat ? { ...m, category: newCat } : m))
    );
  };

  const handleDeleteCategory = (catToDelete: string) => {
    setCategories((prev) => prev.filter((c) => c !== catToDelete));
  };

  // Shop Handlers
  const handleAddShop = (newShop: PharmacyShop) => {
    setShops((prev) => [...prev, newShop]);
  };

  const handleUpdateShop = (updatedShop: PharmacyShop) => {
    setShops((prev) => prev.map((s) => (s.id === updatedShop.id ? updatedShop : s)));
  };

  const handleDeleteShop = (id: string) => {
    setShops((prev) => prev.filter((s) => s.id !== id));
  };

  // Customer Enquiry Handlers
  const handleSubmitEnquiry = (newEnquiry: CustomerEnquiry) => {
    setEnquiries((prev) => [newEnquiry, ...prev]);
  };

  const handleUpdateEnquiryStatus = (id: string, status: 'New' | 'Replied' | 'Resolved') => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  const handleSendReplyToEnquiry = (id: string, replyMessage: string) => {
    const now = new Date();
    const replyDate = `${now.toISOString().slice(0, 10)} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: 'Replied',
              adminReply: replyMessage,
              repliedDate: replyDate,
            }
          : e
      )
    );
  };

  const handleDeleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  // Medicine Inventory CRUD
  const handleAddMedicine = (newMed: Medicine) => {
    setMedicines((prev) => [newMed, ...prev]);
  };

  const handleEditMedicine = (updatedMed: Medicine) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === updatedMed.id ? updatedMed : m))
    );
  };

  const handleDeleteMedicine = (id: string) => {
    if (confirm('Are you sure you want to remove this medicine from inventory records?')) {
      setMedicines((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleUpdateStock = (id: string, newQuantity: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, quantity: newQuantity } : m))
    );
  };

  const handleQuickRestock = (id: string, qty: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, quantity: m.quantity + qty } : m))
    );
  };

  const handleAddToBillFromInventory = (med: Medicine) => {
    setPortalMode('admin');
    setActiveTab('billing');
  };

  // Prescription Handlers
  const handleUpdatePrescriptionStatus = (
    id: string,
    status: 'Pending' | 'Verified' | 'Dispensed'
  ) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const handleAddPrescription = (order: PrescriptionOrder) => {
    setPrescriptions((prev) => [order, ...prev]);
  };

  const handleDispenseToBill = (order: PrescriptionOrder) => {
    setPendingRxPrefill({
      patientName: order.patientName,
      doctorName: order.doctorName,
      items: order.medicines.map((m) => ({ medicineName: m.medicineName, qty: m.qty })),
    });
    handleUpdatePrescriptionStatus(order.id, 'Verified');
    setPortalMode('admin');
    setActiveTab('billing');
  };

  // Supplier Handler
  const handleAddSupplier = (newSup: Supplier) => {
    setSuppliers((prev) => [newSup, ...prev]);
  };

  // POS Billing Handlers
  const handleCompleteBill = (receipt: BillReceipt) => {
    setRecentBills((prev) => [receipt, ...prev]);

    // Deduct stock
    setMedicines((prev) =>
      prev.map((med) => {
        const billedItem = receipt.items.find((item) => item.medicineId === med.id);
        if (billedItem) {
          const newQty = Math.max(0, med.quantity - billedItem.quantity);
          return { ...med, quantity: newQty };
        }
        return med;
      })
    );
  };

  // Reset Data to sample
  const handleResetData = () => {
    if (confirm('Reset medicines, shops, categories, and enquiries back to default sample records?')) {
      localStorage.removeItem(STORAGE_KEYS.MEDICINES);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.SHOPS);
      localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
      localStorage.removeItem(STORAGE_KEYS.PRESCRIPTIONS);
      localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
      localStorage.removeItem(STORAGE_KEYS.BILLS);
      setCategories(INITIAL_CATEGORIES);
      setShops(INITIAL_SHOPS);
      setEnquiries(INITIAL_ENQUIRIES);
      setMedicines(INITIAL_MEDICINES);
      setPrescriptions(INITIAL_PRESCRIPTIONS);
      setSuppliers(INITIAL_SUPPLIERS);
      setRecentBills(
        SAMPLE_RECENT_BILLS.map((b) => ({
          billId: b.billId,
          customerName: b.customerName,
          customerPhone: b.customerPhone,
          date: b.date,
          time: b.time,
          items: [
            {
              medicineId: 'MED-101',
              medicineName: 'Dolo 650 (650mg)',
              batchNo: 'DL-8849',
              dosageForm: 'Tablet',
              unitPrice: 2.15,
              quantity: 20,
              total: 43.0,
            },
          ],
          subtotal: b.grandTotal,
          discountPercent: 0,
          discountAmount: 0,
          taxPercent: 5,
          taxAmount: 0,
          grandTotal: b.grandTotal,
          paymentMode: b.paymentMode,
        }))
      );
      alert('Pharmacy database reset to sample records successfully.');
    }
  };

  const lowStockCount = medicines.filter((m) => m.quantity <= m.minAlertLevel).length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const pendingPrescriptionsCount = prescriptions.filter((p) => p.status === 'Pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header with Portal Switcher */}
      <Header
        portalMode={portalMode}
        onTogglePortalMode={handleTogglePortalMode}
        onResetData={handleResetData}
        onGoHome={() => {
          setPortalMode('user');
          setActiveTab('home');
        }}
      />

      {/* 2. Navigation Tabs (Dynamic for User vs Admin) */}
      <Navigation
        portalMode={portalMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowStockCount={lowStockCount}
        newEnquiriesCount={newEnquiriesCount}
        pendingPrescriptionsCount={pendingPrescriptionsCount}
      />

      {/* 3. Main Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* User Portal Views */}
        {activeTab === 'home' && (
          <HomeView
            medicines={medicines}
            shops={shops}
            categories={categories}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onFilterCategory={(cat) => setCategoryFilterForInventory(cat)}
            onSwitchToAdmin={() => handleTogglePortalMode('admin')}
          />
        )}

        {activeTab === 'browse-medicines' && (
          <InventoryView
            medicines={medicines}
            categories={categories}
            onAddMedicineClick={() => setActiveTab('add-medicine')}
            onDeleteMedicine={handleDeleteMedicine}
            onUpdateStock={handleUpdateStock}
            onEditMedicine={handleEditMedicine}
            onAddToBill={handleAddToBillFromInventory}
            initialCategoryFilter={categoryFilterForInventory}
            isCustomerView={true}
          />
        )}

        {activeTab === 'shop-locator' && (
          <ShopLocatorView
            shops={shops}
            isAdmin={portalMode === 'admin'}
            onAddShop={handleAddShop}
            onUpdateShop={handleUpdateShop}
            onDeleteShop={handleDeleteShop}
          />
        )}

        {activeTab === 'enquiry' && (
          <CustomerEnquiryView
            categories={categories}
            enquiries={enquiries}
            onSubmitEnquiry={handleSubmitEnquiry}
          />
        )}

        {activeTab === 'store-info' && (
          <StoreInfoView />
        )}

        {/* Admin Portal Views */}
        {activeTab === 'dashboard' && (
          <DashboardView
            medicines={medicines}
            prescriptions={prescriptions}
            recentBills={recentBills}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onFilterCategory={(cat) => setCategoryFilterForInventory(cat)}
            onViewBillReceipt={(bill) => setSelectedReceipt(bill)}
            onQuickRestock={handleQuickRestock}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            medicines={medicines}
            categories={categories}
            onAddMedicineClick={() => setActiveTab('add-medicine')}
            onDeleteMedicine={handleDeleteMedicine}
            onUpdateStock={handleUpdateStock}
            onEditMedicine={handleEditMedicine}
            onAddToBill={handleAddToBillFromInventory}
            initialCategoryFilter={categoryFilterForInventory}
            isCustomerView={false}
          />
        )}

        {activeTab === 'add-medicine' && (
          <MedicineFormView
            categories={categories}
            onAddMedicine={handleAddMedicine}
            onNavigateToInventory={() => setActiveTab('inventory')}
          />
        )}

        {activeTab === 'categories-manager' && (
          <CategoriesManagerView
            categories={categories}
            medicines={medicines}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onSelectCategoryFilter={(cat) => {
              setCategoryFilterForInventory(cat);
              setActiveTab('inventory');
            }}
          />
        )}

        {activeTab === 'admin-enquiries' && (
          <AdminEnquiriesView
            enquiries={enquiries}
            onUpdateStatus={handleUpdateEnquiryStatus}
            onSendReply={handleSendReplyToEnquiry}
            onDeleteEnquiry={handleDeleteEnquiry}
          />
        )}

        {activeTab === 'billing' && (
          <BillingView
            medicines={medicines}
            onCompleteBill={handleCompleteBill}
            onViewReceiptModal={(bill) => setSelectedReceipt(bill)}
            pendingRxPrefill={pendingRxPrefill}
            onClearPendingPrefill={() => setPendingRxPrefill(null)}
          />
        )}

        {activeTab === 'prescriptions' && (
          <PrescriptionsView
            prescriptions={prescriptions}
            onUpdateStatus={handleUpdatePrescriptionStatus}
            onAddPrescription={handleAddPrescription}
            onDispenseToBill={handleDispenseToBill}
          />
        )}

        {activeTab === 'suppliers' && (
          <SuppliersView
            suppliers={suppliers}
            onAddSupplier={handleAddSupplier}
          />
        )}
      </main>

      {/* 4. Footer */}
      <Footer
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* 5. Modals */}
      <InvoiceReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
