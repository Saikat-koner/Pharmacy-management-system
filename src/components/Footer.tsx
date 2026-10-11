import React from 'react';
import { Pill, Phone, Mail, ShieldCheck, MapPin, HeartPulse } from 'lucide-react';

interface FooterProps {
  onNavigateTab?: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-10 mt-12 no-print text-xs text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Pharmacy Identity & License (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 font-heading">
                  PharmaCare Chemists &amp; Druggists
                </div>
                <div className="text-slate-500 text-[11px] font-mono">
                  D.L. No: DL-20B/44910, 21B/44911 • GSTIN: 27AAACF8891P1ZV
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Licensed retail pharmacy management system providing verified genuine medications, cold chain temperature preservation, 24/7 emergency branches, and online patient enquiries.
            </p>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-bold text-slate-900 font-heading text-xs uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('home')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Home &amp; Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('browse-medicines')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Browse Medicines Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('shop-locator')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Store Locations &amp; Branch Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('enquiry')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Send Medicine Enquiry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('store-info')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Patient Advisory &amp; Safe Storage
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="font-bold text-slate-900 font-heading text-xs uppercase tracking-wider">
              24/7 Helpline &amp; Orders
            </h4>
            <div className="space-y-2">
              <a
                href="tel:+919845099882"
                className="flex items-center gap-2 text-slate-700 hover:text-emerald-700 font-mono text-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>+91 98450 99882 (24x7 Emergency Line)</span>
              </a>

              <a
                href="mailto:prescriptions@pharmacare.org"
                className="flex items-center gap-2 text-slate-700 hover:text-emerald-700 font-mono text-xs"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>prescriptions@pharmacare.org</span>
              </a>

              <div className="flex items-center gap-2 text-slate-600 text-xs pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Good Pharmacy Practice (GPP) Certified Dispensary</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>
            © {new Date().getFullYear()} PharmaCare Medical Solutions. All Rights Reserved. Compliant with Schedule H Drug Dispensing Norms.
          </div>
          <div className="font-mono text-slate-500">
            Certified CDSCO Retail License • Batch Expiry Verification Active
          </div>
        </div>
      </div>
    </footer>
  );
};
