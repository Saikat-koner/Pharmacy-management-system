import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  User,
  MessageSquare
} from 'lucide-react';
import { PharmacyShop, CustomerEnquiry } from '../types/pharmacy';

interface StoreInfoViewProps {
  shops: PharmacyShop[];
  enquiries: CustomerEnquiry[];
  onSubmitEnquiry: (enquiry: CustomerEnquiry) => void;
}

export const StoreInfoView: React.FC<StoreInfoViewProps> = ({
  shops,
  enquiries,
  onSubmitEnquiry,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Medicine Availability Check');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const ticketId = `ENQ-${Date.now().toString().slice(-4)}`;
    const now = new Date();

    const newEnquiry: CustomerEnquiry = {
      id: ticketId,
      customerName: name.trim(),
      email: email.trim() || 'Not provided',
      phone: phone.trim() || 'Not provided',
      subject,
      category: 'General',
      message: message.trim(),
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'New',
    };

    onSubmitEnquiry(newEnquiry);
    setSubmittedTicket(ticketId);

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');

    setTimeout(() => {
      setSubmittedTicket(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
          <MapPin className="w-6 h-6 text-emerald-600" />
          <span>Pharmacy Store Branches &amp; Contact Enquiries</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Find our licensed pharmacy outlets or submit an enquiry to check medicine availability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Store Branches (7 Cols) */}
        <section aria-labelledby="branches-heading" className="lg:col-span-7 space-y-4">
          <h3 id="branches-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span>Store Locations &amp; Dispensary Branches</span>
          </h3>

          <div className="space-y-4">
            {shops.map((shop) => (
              <article 
                key={shop.id} 
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-200 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-heading">
                      {shop.name}
                    </h4>
                    <p className="text-xs font-mono text-emerald-700 font-medium">
                      Branch Code: {shop.branchCode}
                    </p>
                  </div>

                  {shop.is24x7 ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      24x7 Emergency Care
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Standard Hours
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{shop.address}, {shop.city}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Operating Hours: <strong className="text-slate-800">{shop.timings}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Phone: <strong className="text-slate-800">{shop.phone}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pharmacist-in-Charge: <strong className="text-slate-800">{shop.pharmacistInCharge}</strong></span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {shop.services.map((svc) => (
                    <span 
                      key={svc} 
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-50 text-slate-600 border border-slate-200"
                    >
                      ✓ {svc}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Right Column: Enquiry Form (5 Cols) */}
        <section aria-labelledby="enquiry-form-heading" className="lg:col-span-5 space-y-4">
          <h3 id="enquiry-form-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>Send Medicine Enquiry</span>
          </h3>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            {submittedTicket && (
              <div 
                role="status" 
                className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs space-y-1"
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Enquiry Sent Successfully!</span>
                </div>
                <p>
                  Your Reference Ticket is <strong className="font-mono text-emerald-800">{submittedTicket}</strong>. Our registered pharmacist will review and respond shortly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label htmlFor="enq-name" className="block font-semibold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  id="enq-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amit Kumar"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="enq-email" className="block font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  id="enq-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="enq-phone" className="block font-semibold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  id="enq-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="enq-subject" className="block font-semibold text-slate-700 mb-1">
                  Enquiry Subject
                </label>
                <select
                  id="enq-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Medicine Availability Check">Medicine Availability Check</option>
                  <option value="Prescription Refill Request">Prescription Refill Request</option>
                  <option value="Cold Chain & Insulin Storage">Cold Chain &amp; Insulin Storage</option>
                  <option value="Home Delivery Request">Home Delivery Request</option>
                  <option value="General Question">General Pharmacist Advice</option>
                </select>
              </div>

              <div>
                <label htmlFor="enq-msg" className="block font-semibold text-slate-700 mb-1">
                  Message / Medicine Name &amp; Quantity *
                </label>
                <textarea
                  id="enq-msg"
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please specify which medicine you are looking for..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Submit Enquiry</span>
              </button>
            </form>

            {/* Recent Enquiries Log */}
            {enquiries.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Recent Enquiries ({enquiries.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {enquiries.slice(0, 3).map((enq) => (
                    <div 
                      key={enq.id} 
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1"
                    >
                      <div className="flex justify-between items-center font-bold text-slate-800">
                        <span>{enq.customerName}</span>
                        <span className="font-mono text-emerald-700">{enq.id}</span>
                      </div>
                      <p className="text-slate-600 line-clamp-1">{enq.message}</p>
                      <div className="text-slate-400 text-[10px]">
                        {enq.date} • {enq.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
