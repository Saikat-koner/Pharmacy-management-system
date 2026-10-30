import React from 'react';
import { Pill, Phone, Mail, ShieldCheck, MapPin } from 'lucide-react';
import { AppTabType } from './Navigation';

interface FooterProps {
  onNavigateTab?: (tab: AppTabType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-10 mt-12 no-print text-xs text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Pharmacy Identity & License (6 cols) */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 font-heading">
                  Pharmacy Management System
                </div>
                <div className="text-slate-500 text-[11px] font-mono">
                  D.L. No: DL-20B/44910 • CSE326 Unit 1, 2, 3 Web Project
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              A clean, accessible web portal designed for real pharmacy operations: 
              managing medicine catalog and shelf quantities, fast counter billing with automated GST, 
              sales history tracking, and patient enquiry handling.
            </p>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-bold text-slate-900 font-heading text-xs uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('home')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Home &amp; Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('medicines')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Medicines &amp; Stock
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('billing')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  New Bill (POS Counter)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('sales')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Sales History &amp; Records
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('store')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Store Branches &amp; Enquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-bold text-slate-900 font-heading text-xs uppercase tracking-wider">
              Emergency &amp; Support
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>+91 98765 43210 (24x7 Helpline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>care@pharmacare.org</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Certified Medicines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2 text-[11px]">
          <div>
            © {new Date().getFullYear()} Pharmacy Management System • Built with Semantic HTML5, CSS3 &amp; TypeScript.
          </div>
          <div className="font-mono text-slate-400">
            Units I (HTML), II (Semantic Forms &amp; Tables), III (CSS Layouts &amp; Styling)
          </div>
        </div>
      </div>
    </footer>
  );
};
