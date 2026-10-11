import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle2, Clock, AlertCircle, MessageSquare, Check, ShieldCheck, User } from 'lucide-react';
import { CustomerEnquiry } from '../types/pharmacy';

interface CustomerEnquiryViewProps {
  categories: string[];
  enquiries: CustomerEnquiry[];
  onSubmitEnquiry: (enquiry: CustomerEnquiry) => void;
}

export const CustomerEnquiryView: React.FC<CustomerEnquiryViewProps> = ({
  categories,
  enquiries,
  onSubmitEnquiry,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Medicine Availability');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Emergency'>('Normal');
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const enquiryTypes = [
    'Medicine Availability & Stock Check',
    'Prescription Refill Request',
    'Specialist Formulation Inquiry',
    'Cold Chain & Vaccine Availability',
    'Emergency 24x7 Home Delivery',
    'Price Quote & Health Insurance Claim',
    'General Pharmacist Consultation',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setErrorMessage('Please provide either an email address or mobile phone number for reply.');
      return;
    }

    if (!message.trim()) {
      setErrorMessage('Please enter your enquiry message details.');
      return;
    }

    const now = new Date();
    const newTicket = `ENQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const enquiryRecord: CustomerEnquiry = {
      id: newTicket,
      customerName: name.trim(),
      email: email.trim() || 'Not Provided',
      phone: phone.trim() || 'Not Provided',
      category: category,
      subject: subject.trim() || `Enquiry for ${category}`,
      message: message.trim(),
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'New',
      urgency: urgency,
    };

    onSubmitEnquiry(enquiryRecord);
    setSuccessTicket(newTicket);

    // Reset form fields
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-600" />
            Customer Medicine &amp; Prescription Enquiry Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Need rare medicines, specific brand formulations, or prescription refills? Submit your inquiry directly to our pharmacy team.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono shrink-0">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" /> Average Reply: &lt; 30 mins
          </span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successTicket && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-bold text-emerald-950 font-heading text-sm">
                Enquiry Submitted Successfully!
              </h3>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-emerald-200/60 text-emerald-900 rounded-md">
              Ticket: {successTicket}
            </span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Your inquiry has been routed to our duty pharmacist. We will check physical batch stock and respond to your email/phone shortly. You can also view your ticket status below.
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Enquiry Submission Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Customer Contact Details */}
          <fieldset className="border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <legend className="px-2 text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Customer Contact Information</span>
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="enq-name" className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="enq-name"
                  type="text"
                  required
                  placeholder="e.g. Anand Mahindra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="enq-email" className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  id="enq-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="enq-phone" className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile / WhatsApp Phone
                </label>
                <input
                  id="enq-phone"
                  type="tel"
                  placeholder="+91 98450 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </fieldset>

          {/* Section 2: Enquiry Details */}
          <fieldset className="border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <legend className="px-2 text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>2. Medicine Enquiry Details</span>
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="enq-category" className="block text-xs font-bold text-slate-700 mb-1">
                  Enquiry Nature / Topic
                </label>
                <select
                  id="enq-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <optgroup label="General Enquiry Types">
                    {enquiryTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Specific Therapeutic Categories">
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        Therapeutic: {c}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Urgency Level
                </label>
                <div className="flex items-center space-x-2">
                  {(['Normal', 'Urgent', 'Emergency'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                        urgency === lvl
                          ? lvl === 'Emergency'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : lvl === 'Urgent'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="enq-subject" className="block text-xs font-bold text-slate-700 mb-1">
                Subject Summary
              </label>
              <input
                id="enq-subject"
                type="text"
                placeholder="e.g. Availability for Azithral 500mg tablets (3 strips)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="enq-message" className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Message / Prescription Requirements *
              </label>
              <textarea
                id="enq-message"
                required
                rows={4}
                placeholder="Please describe the medicines you require, prescribed quantity, doctor's prescription details, and your preferred pickup branch or home delivery address..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed"
              ></textarea>
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Schedule H / Rx validation is performed prior to medicine delivery.</span>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Email Enquiry</span>
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Enquiries Tracker for the Customer */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 font-heading text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Recent Enquiries &amp; Status Tracker ({enquiries.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Track pharmacist review status and read direct replies to submitted queries.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {enquiries.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              No enquiries submitted yet. Use the form above to send your first enquiry.
            </p>
          ) : (
            enquiries.map((item) => (
              <div
                key={item.id}
                className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 hover:border-emerald-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {item.id}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-heading">
                      {item.subject}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === 'Replied'
                          ? 'bg-teal-100 text-teal-800 border border-teal-200'
                          : item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.status === 'New' ? 'In Pharmacist Review' : item.status}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {item.date} • {item.time}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.message}
                </p>

                {/* Show Pharmacist Reply if available */}
                {item.adminReply && (
                  <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Official Pharmacist Reply:
                      </span>
                      {item.repliedDate && (
                        <span className="font-mono font-normal text-emerald-700">{item.repliedDate}</span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-950 leading-relaxed font-sans">
                      {item.adminReply}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
