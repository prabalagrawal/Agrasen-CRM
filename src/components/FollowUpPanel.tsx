/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PhoneCall, Calendar, AlertOctagon, CheckCircle2, PlusCircle, MessageSquare } from 'lucide-react';
import { FollowUp } from '../types';

interface FollowUpPanelProps {
  followUps: FollowUp[];
  onToggleFollowUp: (id: string) => void;
  onAddFollowUp: (flp: FollowUp) => void;
  lang: 'EN' | 'HI';
}

export default function FollowUpPanel({ followUps, onToggleFollowUp, onAddFollowUp, lang }: FollowUpPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('2026-07-16');
  const [type, setType] = useState<'Call' | 'Meeting' | 'Payment' | 'Installation'>('Call');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !customerName) return;

    const newFlp: FollowUp = {
      id: `FLP-${Date.now()}`,
      customerId: 'CUST-GEN',
      customerName,
      title,
      date,
      notes,
      isCompleted: false,
      type,
    };

    onAddFollowUp(newFlp);
    setShowAddForm(false);
    setTitle('');
    setCustomerName('');
    setNotes('');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Active Follow-ups Listing column */}
      <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-red-600" />
            {lang === 'EN' ? 'Scheduled Customer Follow-ups' : 'ग्राहक संपर्क विवरण (Follow-ups)'}
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            Schedule Call
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4 animate-fadeIn">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Log Call or Meeting Task</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Lead Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunil Glass House"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Payment due ₹15,000 reminder"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden cursor-pointer"
                >
                  <option value="Call">Call / WhatsApp Check</option>
                  <option value="Meeting">In-Person Meeting</option>
                  <option value="Payment">Outstanding Dues Collection</option>
                  <option value="Installation">Site inspection Fitment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Reference Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Log discussion details or reference quotes..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 resize-none focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-all cursor-pointer shadow-xs">
                Log Follow-up
              </button>
            </div>
          </form>
        )}

        {/* Listing Grid */}
        <div className="space-y-3.5">
          {followUps
            .filter((f) => !f.isCompleted)
            .map((flp) => (
              <div key={flp.id} className="p-4.5 border border-slate-200/80 rounded-2xl bg-white hover:bg-slate-55/10 transition-all flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{flp.customerName}</span>
                    <span
                      className={`text-[8px] px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider ${
                        flp.type === 'Payment'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : flp.type === 'Call'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {flp.type}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800">{flp.title}</div>
                  <p className="text-xs text-slate-550 italic mt-1 font-mono">
                    💬 Note: {flp.notes || 'No reference note added'}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono mt-2 font-medium">Target Date: {flp.date}</div>
                </div>

                <button
                  onClick={() => onToggleFollowUp(flp.id)}
                  className="flex items-center gap-1.5 py-1.5 px-3 border border-slate-300 hover:border-green-600 hover:bg-green-50 hover:text-green-700 rounded-xl text-[10px] font-sans font-bold cursor-pointer transition-all shrink-0 shadow-3xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 hover:text-green-600" />
                  Mark Done
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Done Follow Ups history sidebar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            History Logged Done
          </h4>
          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
            {followUps.filter((f) => f.isCompleted).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10 font-mono">No follow-ups logged done today.</p>
            ) : (
              followUps
                .filter((f) => f.isCompleted)
                .map((flp) => (
                  <div key={flp.id} className="p-3.5 border border-slate-150 rounded-xl bg-slate-50 text-xs opacity-80">
                    <div className="font-bold text-slate-900 line-through">{flp.customerName}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{flp.title}</div>
                    <p className="text-[10px] text-emerald-600 mt-1.5 font-mono font-bold">✓ Resolved Successfully</p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
