import React, { useState, useEffect } from 'react';
import { Medicine, BillReceipt, PharmacyShop, CustomerEnquiry } from './types/pharmacy';
import { 
  INITIAL_MEDICINES, 
  INITIAL_CATEGORIES, 
  INITIAL_SHOPS, 
  INITIAL_BILLS,
  INITIAL_ENQUIRIES 
} from './data/initialData';
import { Header } from './components/Header';
import { Navigation, AppTabType } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { InventoryView } from './components/InventoryView';
import { BillingView } from './components/BillingView';
import { SalesHistoryView } from './components/SalesHistoryView';
import { StoreInfoView } from './components/StoreInfoView';
import { InvoiceReceiptModal } from './components/InvoiceReceiptModal';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  ACTIVE_TAB: 'pharmacare_active_tab',
  MEDICINES: 'pharmacare_medicines_v2',
  SALES: 'pharmacare_sales_v2',
  ENQUIRIES: 'pharmacare_enquiries_v2',
};

export default function App() {
  // 1. Navigation Tab State
  const [activeTab, setActiveTab] = useState<AppTabType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
      if (saved && ['home', 'medicines', 'billing', 'sales', 'store'].includes(saved)) {
        return saved as AppTabType;
      }
    } catch (e) {
      console.error(e);
    }
    return 'home';
  });

  // 2. Medicines State
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDICINES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MEDICINES;
  });

  // 3. Sales Bills State
  const [sales, setSales] = useState<BillReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BILLS;
  });

  // 4. Customer Enquiries State
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ENQUIRIES;
  });

  // 5. Modal and Pre-fill states
  const [selectedReceipt, setSelectedReceipt] = useState<BillReceipt | null>(null);
  const [selectedForBilling, setSelectedForBilling] = useState<Medicine | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
    } catch (e) {
      console.error(e);
    }
  }, [activeTab]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
    } catch (e) {
      console.error(e);
    }
  }, [medicines]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    } catch (e) {
      console.error(e);
    }
  }, [sales]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.error(e);
    }
  }, [enquiries]);

  // Handler: Add Medicine
  const handleAddMedicine = (newMed: Medicine) => {
    setMedicines((prev) => [newMed, ...prev]);
  };

  // Handler: Edit Medicine
  const handleEditMedicine = (updatedMed: Medicine) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === updatedMed.id ? updatedMed : m))
    );
  };

  // Handler: Delete Medicine
  const handleDeleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  // Handler: Quick Stock Update (+1 / -1 / custom)
  const handleUpdateStock = (id: string, newQuantity: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, quantity: newQuantity } : m))
    );
  };

  // Handler: Select medicine to Bill from Inventory
  const handleSelectForBilling = (med: Medicine) => {
    setSelectedForBilling(med);
    setActiveTab('billing');
  };

  // Handler: Complete Sale Bill
  const handleCompleteBill = (receipt: BillReceipt) => {
    // 1. Deduct stock from inventory
    setMedicines((prev) =>
      prev.map((med) => {
        const itemSold = receipt.items.find((i) => i.medicineId === med.id);
        if (itemSold) {
          const newQty = Math.max(0, med.quantity - itemSold.quantity);
          return { ...med, quantity: newQty };
        }
        return med;
      })
    );

    // 2. Add to sales history
    setSales((prev) => [receipt, ...prev]);

    // 3. Show receipt modal immediately
    setSelectedReceipt(receipt);
  };

  // Handler: Submit Enquiry
  const handleSubmitEnquiry = (enquiry: CustomerEnquiry) => {
    setEnquiries((prev) => [enquiry, ...prev]);
  };

  // Handler: Reset Demo Data
  const handleResetData = () => {
    if (
      window.confirm(
        'Reset all demo data back to default initial values? Any custom medicines and bills created will be restored.'
      )
    ) {
      localStorage.removeItem(STORAGE_KEYS.MEDICINES);
      localStorage.removeItem(STORAGE_KEYS.SALES);
      localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
      setMedicines(INITIAL_MEDICINES);
      setSales(INITIAL_BILLS);
      setEnquiries(INITIAL_ENQUIRIES);
      setActiveTab('home');
      setSelectedReceipt(null);
      setSelectedForBilling(null);
    }
  };

  const lowStockCount = medicines.filter((m) => m.quantity <= m.minAlertLevel).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header with Title and Reset */}
      <Header
        onResetData={handleResetData}
        onGoHome={() => setActiveTab('home')}
      />

      {/* 2. Top Navigation (5 Clean Tabs) */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowStockCount={lowStockCount}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'home' && (
          <HomeView
            medicines={medicines}
            sales={sales}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'medicines' && (
          <InventoryView
            medicines={medicines}
            categories={INITIAL_CATEGORIES}
            onAddMedicine={handleAddMedicine}
            onEditMedicine={handleEditMedicine}
            onDeleteMedicine={handleDeleteMedicine}
            onUpdateStock={handleUpdateStock}
            onSelectForBilling={handleSelectForBilling}
          />
        )}

        {activeTab === 'billing' && (
          <BillingView
            medicines={medicines}
            onCompleteBill={handleCompleteBill}
            selectedPreFillMedicine={selectedForBilling}
            onClearPreFill={() => setSelectedForBilling(null)}
          />
        )}

        {activeTab === 'sales' && (
          <SalesHistoryView
            sales={sales}
            onViewReceipt={(receipt) => setSelectedReceipt(receipt)}
            onNavigateToBilling={() => setActiveTab('billing')}
          />
        )}

        {activeTab === 'store' && (
          <StoreInfoView
            shops={INITIAL_SHOPS}
            enquiries={enquiries}
            onSubmitEnquiry={handleSubmitEnquiry}
          />
        )}
      </main>

      {/* 4. Invoice Receipt Modal (Supports window.print()) */}
      {selectedReceipt && (
        <InvoiceReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* 5. Semantic Footer */}
      <Footer onNavigateTab={(tab) => setActiveTab(tab)} />
    </div>
  );
}
