import React, { useState } from 'react';
import { Mail, Phone, Calendar, Clock, CheckCircle, Trash2, MessageSquare, AlertCircle, Send, CheckCircle2, CornerDownRight, X } from 'lucide-react';
import { CustomerEnquiry } from '../types/pharmacy';

interface AdminEnquiriesViewProps {
  enquiries: CustomerEnquiry[];
  onUpdateStatus: (id: string, status: 'New' | 'Replied' | 'Resolved') => void;
  onSendReply: (id: string, replyMessage: string) => void;
  onDeleteEnquiry: (id: string) => void;
}

export const AdminEnquiriesView: React.FC<AdminEnquiriesViewProps> = ({
  enquiries,
  onUpdateStatus,
  onSendReply,
  onDeleteEnquiry,
}) => {
  const [filter, setFilter] = useState<'all' | 'New' | 'Replied' | 'Resolved'>('all');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filtered = enquiries.filter((e) => (filter === 'all' ? true : e.status === filter));

  const handleOpenReplyBox = (enquiry: CustomerEnquiry) => {
    setActiveReplyId(enquiry.id);
    setReplyText(
      enquiry.adminReply ||
      `Dear ${enquiry.customerName},\nThank you for reaching out to PharmaCare. Regarding your enquiry "${enquiry.subject}", we have verified batch availability. `
    );
  };

  const handleSendReplySubmit = (id: string) => {
    if (!replyText.trim()) return;
    onSendReply(id, replyText.trim());
    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-600" />
            Customer Email Enquiries &amp; Medicine Inquiries Inbox
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming medicine availability queries, doctor prescription refill requests, and send recorded replies.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
          {(['all', 'New', 'Replied', 'Resolved'] as const).map((tab) => {
            const count = tab === 'all' ? enquiries.length : enquiries.filter((e) => e.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  filter === tab
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'all' ? `All (${count})` : `${tab} (${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">No enquiries found in this category.</p>
            <p className="text-xs text-slate-400 mt-1">Customer submissions will appear here automatically.</p>
          </div>
        ) : (
          filtered.map((enq) => (
            <div
              key={enq.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-emerald-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {enq.id}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm font-heading">
                    {enq.subject}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {enq.category}
                  </span>
                  {enq.urgency && enq.urgency !== 'Normal' && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      enq.urgency === 'Emergency' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {enq.urgency}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      enq.status === 'New'
                        ? 'bg-amber-100 text-amber-800'
                        : enq.status === 'Replied'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {enq.status}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {enq.date} • {enq.time}
                  </span>
                </div>
              </div>

              {/* Customer Contact details banner */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                <div>
                  <span className="text-slate-400 text-[11px] block">Customer Name:</span>
                  <strong className="text-slate-800">{enq.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Email:</span>
                  <a href={`mailto:${enq.email}`} className="font-mono text-emerald-700 hover:underline">
                    {enq.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Phone:</span>
                  <a href={`tel:${enq.phone.replace(/[^0-9+]/g, '')}`} className="font-mono text-emerald-700 hover:underline">
                    {enq.phone}
                  </a>
                </div>
              </div>

              {/* Message body */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Customer Message:
                </span>
                <p className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/80 leading-relaxed font-sans">
                  {enq.message}
                </p>
              </div>

              {/* Existing Pharmacist Reply if present */}
              {enq.adminReply && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Recorded Pharmacist Reply:
                    </span>
                    {enq.repliedDate && (
                      <span className="font-mono text-[11px] font-normal text-emerald-700">{enq.repliedDate}</span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {enq.adminReply}
                  </p>
                </div>
              )}

              {/* Reply Box Composer (When Active) */}
              {activeReplyId === enq.id && (
                <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CornerDownRight className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Write Official Pharmacist Response to {enq.customerName}:</span>
                    </label>
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter your response to the customer..."
                  ></textarea>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveReplyId(null)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendReplySubmit(enq.id)}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send &amp; Record Reply</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReplyBox(enq)}
                    className="px-3.5 py-1.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{enq.adminReply ? 'Update Reply' : 'Reply to Customer'}</span>
                  </button>

                  {enq.status !== 'Resolved' && (
                    <button
                      onClick={() => onUpdateStatus(enq.id, 'Resolved')}
                      className="px-3 py-1.5 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark as Resolved</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete enquiry from ${enq.customerName}?`)) {
                      onDeleteEnquiry(enq.id);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Enquiry</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
